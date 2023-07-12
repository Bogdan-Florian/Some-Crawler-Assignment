import { app } from './express_app/app.js'
import { client, initializeIndex, updatePhoneNumber } from './persistance/storage.js'

const port = 8080;

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
});

initializeIndex();