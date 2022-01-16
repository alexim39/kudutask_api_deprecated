import { Document } from "mongoose";

export interface TaskStatusInterface extends Document {
    // member property

    remark?: string;
    remarkDate: Date;
    remarkedBy: string[];
    status: string; // pending, in progress or completed
    task: string[];
    
}