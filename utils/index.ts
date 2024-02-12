import * as passport from 'passport';
import { genSalt, compare, hash } from 'bcryptjs';



export const passportAuthCheck = () => passport.authenticate('jwt', { session: false });

export const generateSalt = () => new Promise((resolve, reject) => {
    genSalt(10)
        .then(salt => {
            resolve(salt);
        })
        .catch(err => {
            reject(err)
        })
})

export const hashText = (plainText: string, salt: string) => new Promise((resolve, reject) => {
    hash(plainText, salt)
        .then(hashedText => {
            resolve(hashedText)
        })
        .catch(err => {
            reject(err)
        })
})

export const compareHash = (plainText: string, hashed: string) => new Promise((resolve, reject) => {
    compare(plainText, hashed)
        .then(isMatched => {
            if (isMatched) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
        .catch(err => {
            resolve(err);
        })
})
