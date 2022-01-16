import { Request, Response, NextFunction } from 'express';
import { TaskModel } from '../../models/task/task.model';
import {TaskInterface} from '../../models/task/task.interface';
import {TaskClass} from './task.class';
import {UserInterface} from '../../models/auth/user.interface';


export class TaskController extends TaskClass { 
    constructor() {
        super()
    }

    // create new task
    create(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            // initialise
            const task: TaskInterface = new TaskModel(req.body);

            // save
            task.save((error, task: TaskInterface) => {
                if (error){
                    return res.status(501).json({
                        msg: 'Task creation failed, services error occured', 
                        code: 501
                    });
                }  
                res.status(200).json({
                    msg: 'New task created successfully', 
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


    // get user tasks
    getTasks (req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            const rtasks: TaskInterface[] = [];

            //taskModel.find({ $or:[ {'creator': req.params.userId}, {'assignees.assignee.id': req.params.userId} ]}).exec((error: Error, tasks) => {
            //taskModel.find({ creator: req.params.userId}).populate({path: 'assignees', populate: {path: 'assignee'}}).exec((error: Error, tasks: TaskInterface[]) => { 
            TaskModel.find().populate({path: 'assigned progress', populate: {path: 'assignees assignee'}}).exec((error: Error, tasks: TaskInterface[]) => { 
                if (error) { 
                    res.status(501).json({
                        msg: 'Task record could not be retrieved, services error occured', 
                        code: 501
                    });
                } 

                tasks.forEach((task: TaskInterface) => {
                    if (task.assigned) {
                        task.assigned.assignees.forEach((user: UserInterface) => {
                            if (user._id == req.params.userId) {
                                rtasks.push(task);
                            }
                        })
                    }

                    if (task.creator == req.params.userId) {
                        rtasks.push(task);
                    }
                })

                res.status(200).json({
                    msg: 'Task records was retrieved successfully', 
                    obj: rtasks,
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


    // update task
    update(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            // update
            const updatedTask: TaskInterface = new TaskModel(req.body);
            TaskModel.findByIdAndUpdate(req.body._id, updatedTask, {new: true}, (error: Error, task) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task record could not be updated, services error occured', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Task records was updated successfully', 
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


    // delete tasks
    delete(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
        
            TaskModel.findByIdAndRemove({ _id: req.params.taskId }, {new: true, useFindAndModify: false}, (error: Error, task) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task record could not be removed, service error occured', 
                        code: 501
                    });
                } else if (!task) {
                    res.status(501).json({
                        msg: `No such task record was found`, 
                        code: 501
                    });
                } else {
                    res.status(200).json({
                        msg: 'Task records was removed successfully', 
                        obj: task,
                        code: 200
                    });
                }
                
            });

        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    }


    // archive/unarchive task
    archiveTask (req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            TaskModel.findByIdAndUpdate(req.body.taskId, {isArchive: req.body.isArchive}, {new: true}, (error: Error, task) => {
                if (error) {
                    res.status(501).json({
                        msg: 'Task archive update was not be successful, services error occured', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Task archive update was successfully', 
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

    // get task
    getUserTask (req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            TaskModel.findOne({_id: req.params.taskId}).populate({path: 'assigned progress', populate: {path: 'assignees assignee'}}).exec((error: Error, task) => { 
                if (error) { 
                    res.status(501).json({
                        msg: 'Task record could not be retrieved, services error occured', 
                        code: 501
                    });
                } 
                res.status(200).json({
                    msg: 'Task records was retrieved successfully', 
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

    markTaskAs (req: Request, res: Response, next: NextFunction) {

         // Check authentication
         if (req.isAuthenticated()) {

            TaskModel.findByIdAndUpdate({ _id: req.body.taskId }, {status: req.body.status}, {new: true}, (error: Error, task) => {
                if (error) { 
                    res.status(501).json({
                        msg: 'Task record could not be update, services error occured', 
                        code: 501
                    });
                } 
                res.status(200).json({
                    msg: 'Task records was updated successfully', 
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


}


