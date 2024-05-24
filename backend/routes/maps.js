import express from 'express';
import { getGoogleMaps } from '../settings/googleMaps.js';

const maps = express.Router();

maps.get('/getMapIframe', async (req, res) => {
    const location = req.query.location;  
    const apiKey = await getGoogleMaps(); 
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`;
    res.json({ embedUrl });
});


export default maps;