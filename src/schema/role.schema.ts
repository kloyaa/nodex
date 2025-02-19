import { Schema, model } from 'mongoose';
import { IRole } from '../_core/interfaces/schema/schema.interface';
import { RoleName } from '../_core/enum/roles.enum';

const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    enum: Object.values(RoleName),
    unique: true,
  },
});

export const Role = model<IRole>('Role', roleSchema);
