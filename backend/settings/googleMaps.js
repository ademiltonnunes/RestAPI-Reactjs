import 'dotenv/config';

const googleMaps = process.env.GOOGLE_MAPS;

export async function getGoogleMaps() {
    return googleMaps;
}
