import { Document } from "mongoose";


/* model interface is about the contract of data been sent into the database */
export interface FeedBackInterface extends Document {
    // member property
    
    sender: string; // database id of the user
    tellUsAbout: string;
    feedbackMsg: string;
    reply: boolean;
    modifyDate: Date;
    createDate: Date;
}