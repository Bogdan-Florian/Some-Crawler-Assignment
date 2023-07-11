import express from 'express'
import fs from 'fs'
import csv from 'csv-parser'

export const app = express();
const port = 3000;

app.get('/start', (req, res) => {
    let iterations = 0
    const iterationsLimit = req.query.limit ? req.query.limit : 10;
    console.log(iterationsLimit)
    let stream = fs.createReadStream('sample-websites.csv').pipe(csv());

    stream
        .on('data', (row) => {
            console.log(row)
            if(iterations >= iterationsLimit){
                stream.destroy(); // This stops the read stream
            }
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


