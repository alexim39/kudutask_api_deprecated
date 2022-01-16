import {FeedbackClass} from './feedback.class';
import {FeedbackModel} from './../../models/feedback/feedback.model';
import { Request, Response, NextFunction } from 'express';
import {FeedBackInterface} from './../../models/feedback/feedback.interface';


export class FeedbackController extends FeedbackClass { 

    constructor() {
        super()
    }

    // Handle creating of new feedback
    create(req: Request, res: Response, next: NextFunction){
        // Check authentication
        if (req.isAuthenticated()) {
            // instantiate model
            const FeedBack: FeedBackInterface = new FeedbackModel({
                sender: req.body.userId,
                tellUsAbout: req.body.tellUsAbout,
                feedbackMsg: req.body.feedbackMsg,
                reply: req.body.reply,
            });

            // save
            FeedBack.save((error, feedback) => {
                if (error){
                    return res.json({
                        msg: 'Feedback creation failed, services error occured', 
                        code: 501
                    });
                }  
                res.json({
                    msg: 'Feedback was created successfully', 
                    obj: feedback,
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