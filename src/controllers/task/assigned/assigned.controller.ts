import { Request, Response, NextFunction } from 'express';
import {TaskInterface} from '../../../models/task/task.interface';
import {TaskModel } from '../../../models/task/task.model';
import {assignTaskClass} from './assigned.class';
import {UserInterface} from '../../../models/auth/user.interface';
import {EmailClass} from './../../email/email.class';

export class AssignTaskController extends assignTaskClass { 

    constructor() {
        super()
    }


    // assign task
    newAssign(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            // email body
            const emailBody: string = `
            <h1>New Task Assignment</h1>
            <p>Please note that a new task have been assigned to you</p>
            <p>From Kudutask</p> `;
            // email class
            const email: EmailClass = new EmailClass();

            // update task collection
            TaskModel.findByIdAndUpdate(req.body.taskId, {$push: {'assigned.assignees': req.body.assignees} }, {new: true, useFindAndModify: false}, (error: Error, task: any) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task assignment failed', 
                        code: 501
                    });
                }
                
                // send email
                email.send(req.body.emails, 'New Task Assigned', emailBody);

                res.status(200).json({
                    msg: 'Task assignment was updated successfully', 
                    obj: task,
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

    getAssignees(req: Request, res: Response, next: NextFunction) {
        // Check authentication
        if (req.isAuthenticated()) {

            // get assignees
            TaskModel.findById(req.params.taskId).populate({path: 'assignees'}).exec((error: Error, task) => { 
                if (error) {
                    res.status(501).json({
                        msg: 'Task retrieval failed', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Task retrieval was successful', 
                    obj: task,
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

    // remove assignee
    removeAssignee(req: Request, res: Response, next: NextFunction) {

        if (req.isAuthenticated()) {
    
            TaskModel.findByIdAndUpdate(req.body.taskId, {$pull: {'assigned.assignees': req.body.assigneeId} }, {new: true, useFindAndModify: false}, (error: Error, assignedTask) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Assignee records could not be removed, services error occured', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Assignee records was removed successfully', 
                    obj: assignedTask,
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

