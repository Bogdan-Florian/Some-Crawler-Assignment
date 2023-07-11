import express from 'express'

export const app = express();
const port = 3000;

app.get('/start', (req, res) => {
    res.send('process started');
})


