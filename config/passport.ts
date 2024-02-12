import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../Model/User';
import keys from './keys';

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.secretOrKey
}



export default function (passport: any): void {

    passport.use(new Strategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload, "HERE is passport")
        User.findById(jwt_payload._doc._id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            })
            .catch(err => {
                return done(err, false);
            })
    }))
}