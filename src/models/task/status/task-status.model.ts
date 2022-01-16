import { Schema } from "mongoose"
import {TaskStatusInterface} from './task-status.interface'


const TaskStatusSchema: Schema = new Schema({

    remark: {
        type: String,
        require: false
    },
    
    remarkDate: {
        type: Date,
        require: true
    },
   
    remarkedBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        //required: true
    },

    status: {
        type: String,
        require: true
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
 
export { TaskStatusSchema };