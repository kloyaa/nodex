import { Types } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

export interface IProfile extends Document {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    birthdate: Date;
    address: {
      present: string;
      permanent: string;
    };
    contact: {
      email: string;
      number: string;
    }
    gender: string;
}
