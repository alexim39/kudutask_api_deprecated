import mongoose, { Schema } from "mongoose"
import {UserInterface} from './user.interface'

// Schema
//const UserSchema = Schema<UserDocument, UserInterface>({

const UserSchema: Schema = new Schema({
    lastname: {
        type: String,
        require: true
    },
    firstname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    tnc: { // terms & conditions
        type: Boolean,
        required: true
    },
    startDate: {
        type: Date,
        require: true
    },
    modifyDate: {
        type: Date,
    },
    jobTitle: {
        type: String,
    },
    organization: {
        type: String,
    },
    phone: {
        type: String,
    },
    about: {
        type: String,
    },
});


 // set startDate parameter equal to the current time
 UserSchema.pre('save', function (this: UserInterface, next: any) {

    let now = new Date();
    this.modifyDate = now;

    if (!this.startDate) {
        this.startDate = now;
    }

    next();
})

// instantiate model
const UserModel = mongoose.model<UserInterface>('User', UserSchema);

export { UserModel };