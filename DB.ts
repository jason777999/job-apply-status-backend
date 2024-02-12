import * as mongoose from 'mongoose';
import keys from './config/keys';

export default class DB {
    static connect() {
        return new Promise<void>((resolve, reject) => {
            mongoose.connect(keys.mongoURI!)
                .then(() => {
                    console.log("DB Connected !");
                    resolve();
                })
                .catch(err => {
                    console.log("MONGODB Error !", err);
                    reject();
                })
        })
    }
}