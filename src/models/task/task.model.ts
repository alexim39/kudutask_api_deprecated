import mongoose, { Document, Model, model, Types, Schema, Query } from "mongoose"
import {TaskInterface} from './task.interface'

const TaskSchema: Schema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    priority: {
        type: String,
        require: true
    },
    start: {
        type: Date,
        require: true
    },
    end: {
        type: Date,
    },

    status: {
        type: String, 
        required: false,
        enum: ['Pending', 'In progress', 'Completed'],
        default: 'Pending'
    }, 

    creator: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },

    assigned: {
        description: {
            type: String,
        },
        
        assignedDate: {
            type: Date,
            require: true,
            default: Date.now
        },
       
        modifyDate: {
            type: Date,
            default: Date.now
        },
        
        assignees: [{
            type: Schema.Types.ObjectId,  
            ref: 'User',
            require: true
        }],

    },

    isArchive: {
        type: Boolean, 
    }, 
    
    createDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    modifyDate: {
        type: Date,
        default: Date.now
    },

    progress: [
        {
            isUnderstandTask: {
                type: Boolean,
                require: true
            },
            
            isHaveInfo: {
                type: Boolean,
                require: true,
            },
           
            isStartTask: {
                type: Boolean,
                default: Date.now
            },
        
            assignee: {
                type: Schema.Types.ObjectId, 
                ref: 'User',
                require: true,
            },
            
            isDeclinedTask: {
                type: Boolean,
                require: true,
            },
            
            startDate: {
                type: Date,
                require: true,
                default: Date.now
            },

            challenges: {
                isEncounterChallenge: Boolean,
                comments: String,
                tentativeDate: Date,
            },            
        
            taskCompleteDate: {
                type: Date,
                //default: Date.now
            },
        
            isTaskComplete: {
                type: String,
            }
        }
    ],

    messages : [
        {
            message : String,
            user : {
                type : Schema.Types.ObjectId,
                ref : 'User'
            },
            //delivered : Boolean,
            //read : Boolean,
            sentTime: Date
        }
    ],
});


 // set startDate parameter equal to the current time
 TaskSchema.pre('save', function (this: TaskInterface, next: any) {

    let now = new Date();
    this.modifyDate = now;

    if (!this.createDate) {
        this.createDate = now;
    }

    next();
})


const TaskModel = mongoose.model<TaskInterface>('Task', TaskSchema);

export { TaskModel };