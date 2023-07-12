import { app } from './express_app/app.js'
import { client, initializeIndex, updatePhoneNumber } from './persistance/storage.js'

const port = 8080;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

initializeIndex();



export const updateCompanyWithRandomPhoneNumber = (phoneNumber) => {
  const randomPhoneNumber = '11111-1111' // Generate a random phone number
  
  // Replace 'Company Name' with the actual company name you want to update
  updatePhoneNumber('Greater Boston Zen Center', phoneNumber)
    .then(() => {
      console.log(`Updated company with random phone number: ${phoneNumber}`);
    })
    .catch((error) => {
      console.error('Error updating company:', error);
    });
};
