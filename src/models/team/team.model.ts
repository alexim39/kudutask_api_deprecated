import mongoose, { Schema } from "mongoose"
import {TeamInterface} from './team.interface'

const TeamSchema: Schema = new Schema({
    name: {
        type: String,
        require: true
    },
    members: [{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    description: {
        type: String,
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
    creator: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
    },
    sharedTasks: [{
        type: Schema.Types.ObjectId, 
        ref: 'Task'
    }]
});


 // set startDate parameter equal to the current time
 TeamSchema.pre('save', function (this: TeamInterface, next: any) {

    let now = new Date();
    this.modifyDate = now;

    if (!this.createDate) {
        this.createDate = now;
    }

    next();
})

// instantiate model
const TeamModel = mongoose.model<TeamInterface>('Teams', TeamSchema);
 
export { TeamModel };