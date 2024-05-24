import express from 'express';
import fs from 'fs';
import https from 'https';
import { start } from 'repl';
import cors from 'cors';
import { getLoggerInstance } from './settings/logger.js';

// Loggers
const logger = getLoggerInstance();

// Routes
import startup from './routes/startup.js';
import users from './routes/users.js';
import login from './routes/login.js';
import gallery from './routes/galleries.js';
import photo from './routes/photos.js';
import portal from './routes/photo_portal.js';
import services from './routes/services.js';
import contact from './routes/contact.js';
import maps from './routes/maps.js';


// Middleware
const app = express();

//SSL Certificates
const httpsOptions = {
    key: fs.readFileSync('./SSL/server.key'),
    cert: fs.readFileSync('./SSL/server.crt')
};

//Creating server
const server = https.createServer(httpsOptions,app);
app.use(cors());
app.use(express.json());


app.use('/', startup);
app.use('/user', users);
app.use('/login', login);
app.use('/gallery', gallery);
app.use('/gallery/photo', photo);
app.use('/portal', portal);
app.use('/services', services);
app.use('/contact', contact);
app.use('/maps', maps);

//Starting server
server.listen(8080, () => {
    logger.info('Server running at https://localhost:8080/');
});

