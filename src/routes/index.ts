import {AuthController} from './../controllers/auth/auth.controller';
import {UserController} from './../controllers/user/user.controller';
import {TaskController} from './../controllers/task/task.controller';
import {AssignTaskController} from '../controllers/task/assigned/assigned.controller';
import {TeamController} from './../controllers/team/team.controller';
import {TaskProgressController} from '../controllers/task/progress/progress.controller';
import {FeedbackController} from './../controllers/feedback/feedback.controller';

import { Request, Response, NextFunction } from 'express';


export class Router {

    private authController: AuthController = new AuthController();
    private userController: UserController = new UserController();
    private taskController: TaskController = new TaskController();
    private assignController: AssignTaskController = new AssignTaskController();
    private teamController: TeamController = new TeamController();
    private taskProgressController: TaskProgressController = new TaskProgressController();
    private FeedbackController: FeedbackController = new FeedbackController();


    constructor() {}

    routes(app: any): void { 
        app.route('/').get((req: Request, res: Response, next: NextFunction) => {            
            res.status(200).send('Welcome to kudutask api server!');
        });


        /*** Auth API */
        app.route('/api/signup').post(this.authController.signup);
        app.route('/api/signin').post(this.authController.signin);
        app.route('/api/signout').get(this.authController.signout);
        app.route('/api/password').put(this.authController.changePassword);
        app.route('/api/forgot-password').put(this.authController.newPasswordLink);
        app.route('/api/new-password').put(this.authController.newPassword);
        app.route('/api/activate/:userId').get(this.authController.activate);
        app.route(`/api/activation-link/:userId`).get(this.authController.resendLink);


        /*** User API */
        app.route('/api/user').get(this.userController.getUser); // get a user
        app.route('/api/users').get(this.userController.getUsers); // get users
        app.route('/api/user').put(this.userController.update); // update user
        app.route('/api/user/:userId').delete(this.userController.delete); // delete user


        /***  Team API */
        app.route('/api/team').post(this.teamController.create); // create a new team
        app.route('/api/team').put(this.teamController.update); // update a team
        app.route('/api/team/:teamId').delete(this.teamController.delete); // delete a team
        app.route('/api/team/:userId').get(this.teamController.getTeams); // get all teams as per the user
        // other processes on team object
        app.route('/api/team/members/:id').get(this.teamController.getAllTeamMembers);
        app.route('/api/team/remove/:memberId/:teamId').get(this.teamController.removeTeamMember);
        app.route('/api/team/add').put(this.teamController.addTeamMembers);
        app.route('/api/team/share').put(this.teamController.sharedTask);



        /*** Task API */
        app.route('/api/task').post(this.taskController.create); // create a new task
        app.route('/api/task/:taskId').delete(this.taskController.delete); // delete a task
        app.route('/api/task').put(this.taskController.update); // update a task
        app.route('/api/task/:taskId').get(this.taskController.getUserTask); // get a task
        app.route('/api/tasks/:userId').get(this.taskController.getTasks); // get all tasks as per the user
        // other processes on task object
        app.route('/api/task/archive').put(this.taskController.archiveTask);
        app.route('/api/task/markTaskAs').put(this.taskController.markTaskAs);



        /* Task Assignment API */
        app.route('/api/task/assign').put(this.assignController.newAssign); // save a new assign
        app.route('/api/task/assign/:taskId').get(this.assignController.getAssignees);
        app.route('/api/task/assign/remove').put(this.assignController.removeAssignee);


        /* Task progress API */
        app.route('/api/task/progress').post(this.taskProgressController.taskAcknolegement);
        app.route('/api/task/progress/report').put(this.taskProgressController.taskChallenges);
        app.route('/api/task/progress/complete').put(this.taskProgressController.markAsComplete);
        app.route('/api/task/progress/msg').post(this.taskProgressController.taskMsgs);
        app.route('/api/task/progress/msg/:userId/:taskId').get(this.taskProgressController.getTaskMsgs);
        //app.route('/api/task/progress/acknolegement/:userId/:taskId').get(this.taskProgressController.getTaskAcknolegement);



        /* Feedback API */
        app.route('/api/feedback').post(this.FeedbackController.create); // create a new feedback



    }
}
