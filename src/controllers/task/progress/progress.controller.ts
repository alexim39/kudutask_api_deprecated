import { Request, Response, NextFunction } from 'express';
import {TaskProgressClass} from './progress.class';
import {UserInterface} from '../../../models/auth/user.interface';
import {TaskModel} from '../../../models/task/task.model';
import {TaskInterface} from '../../../models/task/task.interface';


export class TaskProgressController extends TaskProgressClass { 

    constructor() {
        super()
    }


    // task acknoledgement
    taskAcknolegement(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {  

            const ack = {
                isStartTask: req.body.isStartTask,
                isHaveInfo: req.body.isHaveInfo,
                isUnderstandTask: req.body.isUnderstandTask,
                isDeclinedTask: req.body.isDeclinedTask,
                assignee: req.body.userId,
            }

            // update task collection
            TaskModel.findByIdAndUpdate(req.body.taskId, {status: 'In progress', $push: {'progress': ack} }, {new: true, useFindAndModify: false}, (error: Error, task) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task acknowledgement failed to assign to assignees', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Task acknowledgement was updated successfully', 
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

    // task progress report
    taskChallenges(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            
            const challenges = {
                isEncounterChallenge: req.body.isEncounterChallenge,
                comments: req.body.comments,
                tentativeDate: req.body.tentativeDate,
                reportDate: new Date()
            }



            TaskModel.findById(req.body.taskId, (error: Error, task: TaskInterface) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task progress was not updated successfully', 
                        code: 501
                    });
                }
                task.progress.forEach((progress) => {
                    if(progress.assignee == req.body.userId) {

                        progress.challenges = challenges;
                        task.save((error, task: TaskInterface) => {
                            if (error){
                                res.status(501).json({
                                    msg: 'Task progress could not be updated, services error occured', 
                                    code: 501
                                });
                            }  
                            res.status(200).json({
                                msg: 'Task progress was updated successfully', 
                                obj: task,
                                code: 200
                            });
                        });

                    }
                    
                })
            });

        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    }


    // mark task as complete
    markAsComplete(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            const taskCompleteDate: Date =  new Date();

            let status: string;
            if (req.body.isTaskCompleted === true) {
                status = 'Completed'
            } else {
                status = 'In progress'
            }

            TaskModel.findById(req.body.taskId, (error: Error, task: TaskInterface) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task progress was not updated successfully', 
                        code: 501
                    });
                }
                task.progress.forEach((progress) => {
                    if(progress.assignee == req.body.userId) {

                        progress.taskCompleteDate = taskCompleteDate;
                        progress.isTaskComplete = status;
                        task.status = status;
                        task.save((error, task: TaskInterface) => {
                            if (error){
                                res.status(501).json({
                                    msg: 'Task progress could not be updated, services error occured', 
                                    code: 501
                                });
                            }  
                            res.status(200).json({
                                msg: 'Task progress was updated successfully', 
                                obj: task,
                                code: 200
                            });
                        });

                    }
                    
                })
            });

        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    }

    // task progress msgs
    taskMsgs(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            
            const messages = {
                message: req.body.chatMsg,
                user: req.body.userId,
                sentTime: new Date()
            }

            // update task collection
            TaskModel.findByIdAndUpdate(req.body.taskId, {$push: {'messages': messages} }, {new: true, useFindAndModify: false}, (error: Error, task) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task message failed to assign to assignees', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Task message was updated successfully', 
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

    // get task progress msgs
    getTaskMsgs(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            TaskModel.findById(req.params.taskId, (error: Error, task: TaskInterface) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task progress was not updated successfully', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Task progress was updated successfully', 
                    obj: task.messages,
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

/*     // get task acknoledgement
    getTaskAcknolegement(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            
            taskProgressModel.find({ userId: req.params.userId, taskId: req.params.taskId}).populate({path: 'userId taskId'}).exec((error: Error, taskProgress: TaskAssignedProgressInterface[]) => { 
                if (error) {
                    res.status(501).json({
                        msg: 'Task progress retrieval failed to assignees', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Task progress retrieval was successful', 
                    obj: taskProgress,
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

 */



}

