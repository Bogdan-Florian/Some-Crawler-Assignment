import express from 'express'
import fs from 'fs'
import csv from 'csv-parser'
import Queue from 'bull';
import { searchCompanyProfile } from '../persistance/storage.js'

export const app = express();
const websiteQueueProducer = new Queue('websiteQueue', 'redis://127.0.0.1:6379');

app.get('/start', (req, res) => {
    let iterations = 1
    const iterationsLimit = req.query.limit ? Number(req.query.limit) : 10;
    let stream = fs.createReadStream('sample-websites.csv').pipe(csv());

        stream.on('data', (row) => {
            if(iterations >= iterationsLimit){
                stream.destroy(); // This stops the read stream
            }
            console.log(row.domain)
            websiteQueueProducer.add('website', {website: row.domain}, {attempts: 1});
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


app.get('/company', async (req, res) => {
    const { companyDomain } = req.query;

    if (!companyDomain) {
        return res.status(400).send({ message: 'Both param1 and param2 are required.' });
    }

    try {
        searchCompanyProfile(companyDomain).then(searchResult => {
            if (searchResult.hits.total.value > 0) {
                return res.status(200).send(searchResult.hits.hits[0]._source);
            } else {
                return res.status(400).send({ message: 'No matching records found.' });
            }
        });        
    } catch (error) {
        console.error('Error performing search:', error);
        return res.status(500).send({ message: 'Error performing search.' });
    }
});