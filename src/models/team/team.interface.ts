import { Document } from "mongoose";

export interface TeamInterface extends Document {
    // member property
    
    _id?: string;
    name: string;
    members: string[];
    creator: string;
    createDate: Date;
    modifyDate?: Date;
    description: string;
    sharedTasks?: string[]
}