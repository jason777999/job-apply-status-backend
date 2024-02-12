import * as dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoURI: process.env.MONGO_URI,
    secretOrKey : "secret"
}