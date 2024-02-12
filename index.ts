import DB from "./DB";
import Server from "./Server";

DB.connect()
    .then(() => {
        Server.on();
    })
    .catch(err => {
        console.log("MongoDB Error : ", err);
    })