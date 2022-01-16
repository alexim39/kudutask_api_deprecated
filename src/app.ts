import express from "express";
import { Router } from "./routes";
import mongoose from 'mongoose';
import cors from 'cors';
import passport from "passport";
import session from 'express-session';
import connectMongo  from 'connect-mongo';
import config from './config/config';
import { ConfigPassport } from './config/passport';
const MongoStore = connectMongo(session);

class App {
    app: express.Application;
    routes: Router = new Router();

    constructor() {
        this.app = express();
        this.config(); 
        this.routes.routes(this.app); 
        this.mongoSetup();
    }

    private config(): void{
        
        // support application/x-www-form-urlencoded post data
        this.app.use(express.urlencoded({ extended: false }));
        // support application/json type post data
        this.app.use(express.json());
        this.app.use(cors({
            origin: ['http://www.kudutask.com', 'http://localhost:4200', 'http://127.0.0.1:4200'],
            credentials: true
        }));

        
        // Bring in passport local strategy
        new ConfigPassport(passport);
        // Express Session
        this.app.use(session({
            secret: 'kudutask_secret_key',
            name: 'kudutask_sid',
            resave: false,
            saveUninitialized: false,
            cookie: {
              maxAge: 36000000,
              httpOnly: false,
              secure: false
            },
            store: new MongoStore({ mongooseConnection: mongoose.connection })
          }));
        // Passport middleware init
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }

    private mongoSetup(): void{

        // connecto to database
        mongoose.connect(`mongodb+srv://${config.server.username}:${config.server.password}@cluster0.z9jpz.mongodb.net/kudutask?retryWrites=true&w=majority`, { 
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true 
        }).then(() => {
            console.info(`Database server connected`);
        }).catch((error) => console.error(error));
    }

}

export default new App().app;
