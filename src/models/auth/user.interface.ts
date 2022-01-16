import { Document } from "mongoose";

export interface UserInterface extends Document {
    // member property

    firstname: string;
    lastname: string;
    email: string;
    password: string;
    isActive: boolean;
    jobTitle?: string;
    organization?: string;
    //gender?: string,
    //dob?: string,
    phone?: string;
    about?: string;
    //address?: string;
    //city?: string;
    //userType: string; 
    readonly tnc?: boolean; // readonly property cant be changed once they are initialized 
    startDate?: Date;
    modifyDate?: Date;

    // member function
    //hashPasword: (password: string) => string;
    //isValid: (password: string) => boolean;
}