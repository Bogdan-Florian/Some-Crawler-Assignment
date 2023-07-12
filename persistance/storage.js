import elasticsearch from 'elasticsearch';
import csvParser from 'csv-parser';
import fs from 'fs';

export const client = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'trace',
});

export async function initializeIndex() {
    const exists = await client.indices.exists({ index: 'company-profiles' });
  
    if (!exists) {
      await client.indices.create({ index: 'company-profiles' });
    }
  
    const results = [];
  
    fs.createReadStream('sample-websites-company-names.csv')
    .pipe(csvParser())
      .on('data', (data, rowNumber) => {
        data.rowNumber = rowNumber; // add rowNumber to each data object
        results.push(data);
      })
      .on('end', async () => {
        // When all data is loaded, insert it to Elasticsearch
        for (let result of results) {
          await client.index({
            index: 'company-profiles',
            id: result.rowNumber, // use rowNumber as document ID
            body: result,
          });
        }
      });
  }

export async function updatePhoneNumber(domain, phoneNumber) {
  const searchResult = await client.search({
    index: 'company-profiles',
    body: {
      query: {
        match: {
          'domain.keyword': domain,
        },
      },
    },
  });

  const hits = searchResult.hits.hits
  if (hits.length === 0) {
    throw new Error(`No document found with company name: ${companyName}`);
  }

  const documentId = hits[0]._id;

  await client.update({
    index: 'company-profiles',
    id: documentId,
    body: {
      doc: {
        phoneNumber,
      },
    },
  });
}

