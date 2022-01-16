import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../models/auth/user.model';
import {UserInterface} from '../../models/auth/user.interface';
import {UserClass} from './user.class';
import {EmailClass} from './../email/email.class';


export class UserController extends UserClass { 

    constructor() {
        super()
    }

    // get a user
    getUser (req: Request, res: Response, next: NextFunction) {
        // Check authentication
        if (req.isAuthenticated()) {
            return res.status(200).json({
                msg: 'User records was retrieved successfully', 
                obj: req.user,
                code: 200
            });
        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    }

    // get users
    getUsers (req: Request, res: Response, next: NextFunction) {
        // Check authentication
        if (req.isAuthenticated()) {

            UserModel.find({}, (error: Error, users: UserInterface[]) => {
                if (error){
                    return res.status(501).json({
                        msg: 'Users emails was not retrieved successfully', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Users emails was retrieved successfully', 
                    obj: users,
                    code: 200
                });
            });
        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    }

    // update user handler
    update(req: Request, res: Response, next: NextFunction) {

        if (req.isAuthenticated()) {
            // update
            const updatedProfile = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                jobTitle: req.body.jobTitle,
                organization: req.body.organization,
                about: req.body.about,
                modifyDate: new Date()
            };
            UserModel.findByIdAndUpdate(req.body.userId, updatedProfile, {new: true}, (error: Error, user) => {
                if (error){
                    return res.status(501).json({
                        msg: `User profile update failed`, 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: `User profile was update successfully`, 
                    obj: user,
                    code: 200
                });
            });
            
        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    
    }

    // delete a user
    delete (req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated()) {
           
            UserModel.findByIdAndRemove(req.params.userId, {new: true, useFindAndModify: false}, (error: Error, user) => {
                if (error) {
                    return res.status(501).json({
                        msg: 'User profile could not be removed, services error occured', 
                        code: 501
                    });
                } 
                if (!user) {
                    return res.status(501).json({
                        msg: `No profile exit for this record`, 
                        code: 501
                    });
                }
                // get user email
                const emails: string[] = [];
                emails.push(user.email);

                // send email inform user of account removal 
                // email body
                const emailBody: string = `
                <h1>Account Removal</h1>
                <p> Hi ${user.lastname} ${user.firstname},</p>
                <p>This is notify you that your account have been deleted successfully</p>
                <p>From Kudutask</p> `;
                // email class
                const email: EmailClass = new EmailClass();
                // send email
                email.send(emails, 'Account Deleted', emailBody);

                res.status(200).json({
                    msg: 'User profile was removed successfully', 
                    obj: user,
                    code: 200
                });
                
            });

        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    }

}
