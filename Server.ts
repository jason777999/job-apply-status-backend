import * as express from 'express';
import { Request, Response, Application } from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import keys from './config/keys';
import api from './routes/index';
import passportCheck from './config/passport'

type PORT_TYPE = number | string | any;
type APP_TYPE = Application | null;

export default class Server {

    app: APP_TYPE = null;

    init = (): void => {

        //  init server
        this.app = express();

        // apply middlewares
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(passport.initialize());

        passportCheck(passport);
    }

    listen = (port: PORT_TYPE): Promise<void> => new Promise((resolve) => {
        this.app?.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
            resolve();
        })
    })


    static on = (): void => {

        const server = new Server();

        server.init();

        server.listen(keys.port)
            .then(() => {
                // routers
                server.app?.use('/api', api);
            })
    }

}