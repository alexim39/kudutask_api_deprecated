import bcrypt from 'bcrypt';
import LocalStrategy from "passport-local";
import {UserInterface} from './../models/auth/user.interface';
import { UserModel } from './../models/auth/user.model';

export class ConfigPassport {

    constructor (passport: any) {

        passport.use( new LocalStrategy.Strategy({ usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
            // Match User
            UserModel.findOne({ email: email }, (error: Error, user: UserInterface) => {
                if (error) { 
                    return done(error); 
                }
                if (!user) {
                    return done(undefined, false, { message: `This email does not exist, confirm the email and try again` });
                }
                // User found
                /* if (user.active === false) {
                    return done(undefined, false, {message: `This account is not yet active, check your email to activate account`})
                } else { */
                    // Match Password
                    bcrypt.compare(password, user.password, (error: Error, isMatch: boolean) => {
                        if (error) { 
                            return done(error); 
                        }
                        if (isMatch) {
                            // Password matched
                            return done(undefined, user);
                        }
                        return done(undefined, false, { message: `Authentication failed, confirm your password and try again` });
                    });
                //}
                
            });
          }));
          passport.serializeUser((user: any, done: any) => {
            done(undefined, user._id);
          });
          passport.deserializeUser((id: string, done: any) => {
            UserModel.findById(id, (error: Error, user: any) => {
              done(error, user);
            });
          });

    }
}
