import 'dotenv/config';

const secret = process.env.SECRET;

export async function getSecret() {
    return secret;
}
