import { Types, Document } from 'mongoose';

export interface IActivity {
  user: Types.ObjectId;
  description: string;
}
