import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import passport from "passport";
import { AuthClass } from './auth.class';
import { UserModel } from './../../models/auth/user.model';
import {UserInterface} from './../../models/auth/user.interface';
import {EmailClass} from './../email/email.class';

export class AuthController extends AuthClass { 

    constructor() {
        super()
    }

    // Handle sign up
    signup(req: Request, res: Response, next: NextFunction) {
    
        UserModel.findOne({ email: req.body.email }, (error: Error, user: UserInterface) => {
    
            if (user) {
                // user exist
                return res.status(501).json({
                    msg: `This email has already been signed up, please use another email`,
                    code: 501
                });
            } else {
        
                // instantiate model
                const user: UserInterface = new UserModel(req.body); 
    
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(user.password, salt, (error, hashedPsswd) => {
                        if (error){
                            return res.status(501).json({
                                msg: `Password hashing failed`,
                                code: 501
                            });
                        }
                        // set password to hashed
                        user.password = hashedPsswd;
                    
                        // check if user accepted terms and condition
                        if (req.body.tnc === true) {
                            user.save((error, user: UserInterface) => {
                                if (error){
                                    return res.status(501).json({
                                        msg: `Sign up process failed, please check your inputs and try again`,
                                        code: 501
                                    });
                                }    
                                res.status(200).json({
                                    code: 200,
                                    msg: `User account have been successfully created`, 
                                    obj: user
                                });

                                // email class
                                const email: EmailClass = new EmailClass();
                                // send email
                                email.sendAccountActivationLink(user);
                            });
                        } else {
                            res.status(501).json({
                                message: `Please accept and check our Terms and Condition checkbox`,
                                code: 501
                            });
                        }
                    })
                })
            }
        })    
    }

    // Handle sign in
    signin (req: Request, res: Response, next: NextFunction) {

        passport.authenticate('local', (error: Error, user, info) => {
            if(error) {
                return res.json({
                    code: 501,
                    msg: 'Sign in failed, due to network error'
                });
            }
            if (!user) {
                return res.json({
                    code: 501,
                    msg: info,
                });
            }
            req.logIn(user, (error: Error) => {
                if (error) {
                    return res.json({
                        code: 501,
                        msg: 'Sign in failed, due to network error'
                    });
                }
                return res.json({ 
                    code: 200,
                    msg: 'Sign in successful', 
                    obj: user 
                })
            });
        })(req, res, next);
     
    }

    // Handle sign out
    signout(req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) {
            // Uses passport middleware
            req.logout();
            return res.status(200).clearCookie('kudutask_sid').json({
                msg: 'signed out',
                code: 200
            })
        } else{
            return res.json({
                msg: 'Unauthorized request',
                code: 401
            });
        }     
    }

    // Handle user password change
    changePassword(req: Request, res: Response, next: NextFunction) {

        if (req.isAuthenticated()) {

            UserModel.findById(req.body.userId, (error: Error, user: UserInterface) => { 
                if (error) { 
                    res.status(501).json({
                        msg: `Password change failed, service error occured`,
                        code: 501
                    });  
                } else { 
                    
                    bcrypt.compare(req.body.current, user.password, (error: Error, user) => {
                        if (error){
                            res.status(501).json({
                                msg: 'An error occured while changing your password, please try again',
                                code: 501
                            });
                            console.error(error)
                        } 
                        if (user) {
                            // hash user new password
                            bcrypt.genSalt(10, (error, salt) => {
                                bcrypt.hash(req.body.new, salt, (error, hashedPassword) => {
                                    if (error){
                                        return res.status(501).json({
                                            msg: 'Password hashing was not completed',
                                            code: 501
                                        });
                                    }

                                    // update password to new password
                                    UserModel.findByIdAndUpdate(req.body.userId, { password: hashedPassword }, {new: true, useFindAndModify: false}, (error: Error, user) => {
                                        if (error) {
                                            return res.status(501).json({
                                                msg: 'Password change was not successful, service error occured',
                                                code: 501
                                            });
                                        }
                                        return res.status(200).json({
                                            msg: `Password changed successfully`, 
                                            obj: user,
                                            code: 200
                                        });
                                    })

                                })
                            })

                        } else {
                            // response is OutgoingMessage object that server response http request
                            return res.status(501).json({
                                msg: 'Currrent password is incorrect',
                                code: 501
                            });
                        }
                    });
                } 
            });

        } else {
            return res.json({
                msg: 'Unauthorized request',
                code: 401
            });
        }    

    }


    // Handle forgot password
    newPasswordLink (req: Request, res: Response, next: NextFunction) {
        // find user with associated email
        // and send link for password change to inbox
            

        UserModel.findOne({email: req.body.email}, (error: Error, user: UserInterface) => {
            if (error) {
                return res.status(501).json({
                    msg: `Could not get user, service error occured`,
                    code: 501
                });
            }
            if (!user) {
                return res.status(501).json({
                    msg: `User with this email does not exist`,
                    code: 501
                });
            }

            // send new passwor link mail
            // http://kudutask.com/new-password/${user._id}
            // http://localhost:4200/new-password/${user._id}

            // email body
            const emailBody: string = `
            <h1>New Password Link</h1>
            <p> Hi ${user.lastname} ${user.firstname},</p>
            <p>Kindly use the link below to change your account password</p>
            <br>
            <a href="http://localhost:4200/new-password/${user._id}" target="_blank" 
                style="background-color: #4A2781; 
                color: white; 
                padding: 15px 32px;
                text-decoration: none;
                text-align: center;
                border: 1px solid gray; 
                font-size: 16px;
                text-transform: uppercase;
                display: inline-block;">Change Password</a>
            <p>From Kudutask</p> `;
            // email class
            const email: EmailClass = new EmailClass();
            // send email
            email.send(req.body.email, 'Forgot Password Link', emailBody);

            res.status(200).json({
                msg: `New password link have been sent to your email`, 
                obj: user,
                code: 200
            });
       });
    }

    // Handle resend link
    newPassword(req: Request, res: Response, next: NextFunction) {

        UserModel.findById(req.body.userId, (error: Error, user: UserInterface) => {
            if (error) {
                return res.status(501).json({
                    msg: `Your password was not changed. Something went wrong`,
                    code: 501
                });
            }
            if (!user) {
                return res.status(502).json({
                    msg: `Password change failed - no user found with this link`,
                    code: 502
                });
            }

            // update it with hash
            bcrypt.genSalt(10, (error, salt) => {
                bcrypt.hash(req.body.password, salt, (error, hashedPassword) => {
                    if (error){
                        return res.status(501).json({
                            msg: 'Password hashing was not completed',
                            code: 501
                        });
                    }
                    user.password = hashedPassword;
                    user.save((error, user: UserInterface) => {
                        if (error){
                            return res.status(501).json({
                                msg: `Password change failed - service error occured`,
                                code: 501
                            });
                        } 

                        // get user email
                        const emails: string[] = [];
                        emails.push(user.email);

                        // send email inform user of password change 
                        // email body
                        const emailBody: string = `
                        <h1>Password Changed</h1>
                        <p> Hi ${user.lastname} ${user.firstname},</p>
                        <p>This is notify you that your account password have been changed successfully</p>
                        <p>From Kudutask</p> `;
                        // email class
                        const email: EmailClass = new EmailClass();
                        // send email
                        email.send(emails, 'Successful Password Change', emailBody);

                        res.status(200).json({
                            msg: `Your password have been successfully changed`, 
                            obj: user,
                            code: 200
                        })                
                    });
                });
            })            
        })
    }

    // Handle activate account
    activate(req: Request, res: Response, next: NextFunction) {

        UserModel.findById(req.params.userId, (error: Error, user: UserInterface) => {
            if (error) {
                return res.status(501).json({
                    msg: `Your account could not be activated. Something went wrong`,
                    code: 501
                });
            }
            if (!user) {
                return res.status(502).json({
                    msg: `Activation failed - no user found with this link`,
                    code: 502
                });
            }
            if (user.isActive) {
                return res.status(502).json({
                    msg: `Activation failed - your account is already active`,
                    code: 502
                });
            }
            user.isActive = true;
            user.save((error, user: UserInterface) => {
                if (error){
                    return res.status(501).json({
                        msg: `Activation failed - service error occured`,
                        code: 501
                    });
                }    
                res.status(200).json({
                    msg: `Your account have been successfully activated`, 
                    obj: user,
                    code: 200
                })                
            });
        })
    }

    // Handle resend link
    resendLink (req: Request, res: Response, next: NextFunction) {

        if (req.isAuthenticated()) {

            UserModel.findById(req.params.userId, (error: Error, user: UserInterface) => {
                if (error) {
                    return res.status(501).json({
                        msg: `Could not send link. Something went wrong`,
                        code: 501
                    });
                }
                if (!user) {
                    return res.status(502).json({
                        msg: `Something went wrong - your account was not found`,
                        code: 502
                    });
                }
                // email class
                const email: EmailClass = new EmailClass();
                // send email
                email.sendAccountActivationLink(user);
                res.status(200).json({
                    msg: `Account activation link have been resent to your mail`,
                    code: 200
                });
            })

        } else{
            return res.json({
                msg: 'Unauthorized request',
                code: 401
            });
        }   
    }


}
