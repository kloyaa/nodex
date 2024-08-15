import { Response, NextFunction } from 'express';
import { User } from '../../schema/user.schema';
import { TRequest } from '../interfaces/overrides.interface';
import { statuses } from '../const/api.statuses';
import { RoleName } from '../enum/roles.enum';

export const authorize = (roles: RoleName[]) => {
  return async (req: TRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).populate('roles');

    if (!user) {
      return res.status(404).json(statuses['0056']);
    }

    const userRoles = user.roles.map((role) => role.name);
    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json(statuses['0057']);
    }

    next();
  };
};
