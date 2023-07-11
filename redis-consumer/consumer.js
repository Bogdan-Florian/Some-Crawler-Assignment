import Queue from 'bull';
import axios from 'axios';

// Define the job queue
const websiteQueueConsumer = new Queue('websiteQueue', 'redis://127.0.0.1:6379');

websiteQueueConsumer.process('website', async (job, done) => {
    try {
      console.log(`Fetching Website no.${job.data.rowNumber}: http://${job.data.website}`);
      const response = await axios.get(`http://${job.data.website}`, { 
      });
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