import { Document } from "mongoose";
import {UserInterface} from './../auth/user.interface';


export interface TaskInterface extends Document {
    // member property

    _id?: string;
    title: string;
    description?: string;
    priority: string;
    start: Date;
    end: Date;
    modifyDate?: Date;
    createDate: Date;
    creator: string;
    isArchive?: boolean;
    status?: string;
    assigned?: {
        description: string;
        assignedDate?: Date;
        modifyDate?: Date;
        assignees: UserInterface[];
    };
    progress: [{
        isUnderstandTask?: boolean;
        isHaveInfo?: boolean;
        isStartTask?: boolean;
        assignee?: string | UserInterface;
        isDeclinedTask?: boolean;
        startDate?: Date
        taskCompleteDate?: Date;
        isTaskComplete?: string;
        challenges?: {
            isEncounterChallenge?: boolean;
            comments?: string;
            tentativeDate?: Date;
        }
    }];
    messages: [{
        message: string;
        user: string;
        sentTime: Date
    }]
}