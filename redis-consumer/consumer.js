import puppeteer from 'puppeteer';
import Queue from 'bull';
import { findNumberByTagStrategy } from '../strategy/StrategyImplementations.js';
import { updatePhoneNumber } from '../persistance/storage.js'
import cheerio from 'cheerio';

// Define the job queue
const websiteQueueConsumer = new Queue('websiteQueue', 'redis://127.0.0.1:6379');

websiteQueueConsumer.process('website', async (job, done) => {
  try {
    console.log(`Fetching Website: http://${job.data.website}`);

    const browser = await puppeteer.launch({
        headless: 'new'
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(3000)
    await page.goto(`http://${job.data.website}`, { waitUntil: 'networkidle0' }); // Wait until page is fully loaded

    // Get all links on the page
    const hrefs = await page.$$eval('a[href]', links => links.map(link => link.getAttribute('href')));

    // Find a link that contains "/contact"
    const contactLink = hrefs.find(href => href.includes('/contact'));

    if (contactLink) {
      console.log(`Contact page found: ${contactLink}`);
      // Navigate to the contact page
      let contactUrl;
      // Check if link is relative or absolute
      if (contactLink.startsWith('http')) {
        contactUrl = contactLink;
      } else {
        contactUrl = new URL(contactLink, `http://${job.data.website}`).href;
      }
      await page.goto(contactUrl, { waitUntil: 'networkidle0' });
      console.log(`Navigated to contact page: ${contactUrl}`);

      // Extract the page's HTML content
      const html = await page.content();
      const $ = cheerio.load(html);

      const phoneNumberPattern = `\\d+`;

      const phoneNumbersByTag = findNumberByTagStrategy.executeStrategy({ cheerioElements: $, regexExpTarget: phoneNumberPattern });
      if(phoneNumbersByTag.length > 0 ){
        updatePhoneNumber(job.data.website, phoneNumbersByTag.join("/"))
      }
      console.log(`Phone Numbers found by Tag Strategy: ${phoneNumbersByTag}`);
    } else {
      console.log('Contact page not found');
    }

    await browser.close();
    done();
  } catch (err) {
    done(new Error(`Failed to retrieve website: ${err.message}`));
  }
});

websiteQueueConsumer.on('error', (error) => {
  console.error(`Error in job queue: ${error.message}`);
});

websiteQueueConsumer.on('completed', (job, result) => {
  console.log(`Job completed`);
});

websiteQueueConsumer.on('failed', (job, err) => {
  console.log('Job failed', err);
  job.remove();
});

websiteQueueConsumer.on('stalled', (job) => {
  console.log(`Job ${job.id} is stalled`);
});