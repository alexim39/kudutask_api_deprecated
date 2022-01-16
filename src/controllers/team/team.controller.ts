import { Request, Response, NextFunction } from 'express';
import { TeamModel } from '../../models/team/team.model';
import {TeamInterface} from '../../models/team/team.interface';
import {TeamClass} from './team.class';

export class TeamController extends TeamClass { 

    constructor() {
        super()
    }


    // create new team
    create(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            // instantiate
            const team = new TeamModel({
                creator: req.body.creator,
                name: req.body.name,
                description: req.body.description,
                members: req.body.members
            });
            // save
            team.save((error, team) => {
                if (error){
                    return res.json({
                        msg: 'Team creation failed, services error occured', 
                        code: 501
                    });
                }  
                res.json({
                    msg: 'Team created successfully', 
                    obj: team,
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


    // update team detaila
    update(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            
            TeamModel.findOneAndUpdate({ _id: req.body.teamId }, {name: req.body.newTeamName, description: req.body.newDescription }, {new: true}, (error, team) => {
                if (error) {
                    return res.status(501).json({
                        msg: 'Team update failed, services error occured', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Team records was upadated successfully', 
                    obj: team,
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

    // get a user teams
    getTeams(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            TeamModel.find({ $or:[ {'creator': req.params.userId}, {'members': req.params.userId} ]}).exec((error: Error, teams: TeamInterface[]) => {   
               if (error) {
                    return res.status(501).json({
                       msg: 'Team records could not be retrieved, services error occured', 
                       code: 501
                   });
               }
               res.status(200).json({
                   msg: 'Team records was retrieved successfully', 
                   obj: teams,
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


    // get all users related to current user teams
    getAllTeamMembers(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            
            TeamModel.find({ $or:[ {'creator': req.params.id}, {'members': req.params.id} ]}).populate({path: 'members sharedTasks'}).exec((error: Error, teams: TeamInterface[]) => {

                if (error) {
                    return res.status(501).json({
                        msg: 'Team members record could not be retrieved, services error occured', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Team members records was retrieved successfully', 
                    obj: teams,
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

    // remove a user
    removeTeamMember(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            
            TeamModel.findOneAndUpdate({ _id: req.params.teamId }, { $pull: { members: req.params.memberId }}, {new: true}, (error, team) => {
                if (error) {
                    return res.status(501).json({
                        msg: 'User records could not be removed, services error occured', 
                        code: 501
                    });
                }
                if (!team) {
                    return res.status(501).json({
                        msg: `No such user records was found`, 
                        code: 501
                    });
                } 
                res.status(200).json({
                    msg: 'User records was removed successfully', 
                    obj: team,
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

    // delete team
    delete(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {
            
            TeamModel.findByIdAndRemove(req.params.teamId, {new: true, useFindAndModify: false}, (error, team) => {
                if (error) {
                    return res.status(501).json({
                        msg: 'Team records could not be removed, services error occured', 
                        code: 501
                    });
                }
                if (!team) {
                    return res.status(501).json({
                        msg: `No such team record was found`, 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Team records was removed successfully', 
                    obj: team,
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


    // add team members
    addTeamMembers(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            // get previouse team members
            TeamModel.findById(req.body.teamId, (error: Error, team: TeamInterface) => {   
                if (error) {
                    return res.status(501).json({
                        msg: 'Team record was not found', 
                        code: 501
                    });
                }
                //uniqTeamMembersId = req.body.teamMembersID.filter((id: string) => !team.members.includes(id));
                req.body.teamMembersID = req.body.teamMembersID.filter((id: string) => {
                    return team.members.indexOf(id) == -1;
                });

                TeamModel.findByIdAndUpdate(req.body.teamId, {$addToSet : {'members': req.body.teamMembersID} }, {new: true, useFindAndModify: false}, (error, team) => {
                    if (error) {
                        return res.status(501).json({
                            msg: 'Team members record could not be added, services error occured', 
                            code: 501
                        });
                    }
                    res.json({
                        msg: 'Team members records was retrieved successfully', 
                        obj: team,
                        code: 200
                    });
                }); 

            });           

        } else{
            return res.status(401).json({
                msg: 'Unauthorized request',
                code: 401
            });
        }
    }


    // share task
    sharedTask(req: Request, res: Response, next: NextFunction) {

        // Check authentication
        if (req.isAuthenticated()) {

            const taskId: string = req.body.taskId;
            //const creator: string = req.body.creator;
            const teamIDs: string[] = req.body.teamsToShareTaskWith;

            TeamModel.updateMany({ _id: { $in: teamIDs}}, {$push: {sharedTasks: taskId} }, {new: true, useFindAndModify: false}, (error, team) => {
                if (error) {
                    return res.status(501).json({
                        msg: 'Team records could not be shared, services error occured', 
                        code: 501
                    });
                }
                res.status(200).json({
                    msg: 'Team records was shared successfully', 
                    obj: team,
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
