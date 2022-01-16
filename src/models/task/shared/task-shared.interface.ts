import { Document } from "mongoose";

export interface TaskSharedInterface extends Document {
    // member property

    description?: string;
    shareDate: Date;
    modifyDate?: Date;
    sharer: string;
    sharedWith: string[];
    task: string[];
    
}