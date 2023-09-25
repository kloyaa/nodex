import { Schema, model } from 'mongoose';
import { IProfile } from '../_core/interfaces/schema/schema.interface';

const profileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    address: {
      present: {
        type: String,
        required: true,
      },
      permanent: {
        type: String,
        required: false,
      },
    },
    contact: {
      email: {
        type: String,
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
  },
  { timestamps: true },
);

const Profile = model<IProfile>('Profile', profileSchema);

export default Profile;
