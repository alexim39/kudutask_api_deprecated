import { Schema } from "mongoose"
import {TaskSharedInterface} from './task-shared.interface'


const TaskSharedSchema: Schema = new Schema({

    description: {
        type: String,
        require: false
    },
    
    shareDate: {
        type: Date,
        require: true
    },
   
    sharer: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        //required: true
    },
    
    sharedWith: {
        type: Schema.Types.ObjectId,  
        ref: 'User',
        require: false
    },

    task: {
        type: Schema.Types.ObjectId,  
        ref: 'Task',
        require: false
    }

});


/*  // set startDate parameter equal to the current time
 TaskSchema.pre('save', function (this: TaskInterface, next: any) {

    let now = new Date();
    this.modifyDate = now;

    if (!this.createDate) {
        this.createDate = now;
    }

    next();
}) */
 
export { TaskSharedSchema };