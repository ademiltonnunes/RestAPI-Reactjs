import express from 'express';
const startup = express.Router();

startup.get('/', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.send('It is working!');
});

//Making the file exportable to be used in another file
export default startup;