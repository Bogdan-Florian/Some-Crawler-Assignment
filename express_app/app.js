import express from 'express'
import fs from 'fs'
import csv from 'csv-parser'
import Queue from 'bull';

export const app = express();
const websiteQueue = new Queue('websiteQueue', 'redis://127.0.0.1:6379');

app.get('/start', (req, res) => {
    let iterations = 1
    const iterationsLimit = req.query.limit ? Number(req.query.limit) : 10;
    let stream = fs.createReadStream('sample-websites.csv').pipe(csv());

        stream.on('data', (row) => {
            if(iterations >= iterationsLimit){
                stream.destroy(); // This stops the read stream
            }
            websiteQueue.add(row);
            iterations += 1;
            
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        })
        .on('close', () => {
            console.log(`Finished reading only ${iterationsLimit}`)
        });
    res.send(`${iterationsLimit} websites have been sent for processing`)
})


websiteQueue.process(async (job, done) => {
    try {
      console.log(`Website: ${job.data.domain}`);
      done();
    } catch (err) {
      done(new Error(`Failed to retrieve website: ${err.message}`));
    }
  });