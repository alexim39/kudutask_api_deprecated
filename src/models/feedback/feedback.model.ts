import mongoose, { Schema } from "mongoose"
import {FeedBackInterface} from './feedback.interface'

const FeedbackSchema: Schema = new Schema({
    sender: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    tellUsAbout: {
        type: String,
        require: true
    },
    feedbackMsg: {
        type: String,
        require: true
    },
    reply: {
        type: Boolean,
        require: true
    },
    createDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    modifyDate: {
        type: Date,
        default: Date.now
    }
});


 // set startDate parameter equal to the current time
 FeedbackSchema.pre('save', function (this: FeedBackInterface, next: any) {

    let now = new Date();
    this.modifyDate = now;

    if (!this.createDate) {
        this.createDate = now;
    }

    next();
})

// instantiate model
const FeedbackModel = mongoose.model<FeedBackInterface>('Feedback', FeedbackSchema);
 
export { FeedbackModel };