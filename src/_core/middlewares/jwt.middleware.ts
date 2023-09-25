import jwt from 'jsonwebtoken';
import { statuses } from '../const/api.statuses';
import { getEnv } from '../config/env.config';

export const isAuthenticated = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json(statuses['10020']);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json(statuses['10020']);
    }

    const env = await getEnv();

    jwt.verify(token, env?.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json(statuses['10020']);
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json(statuses['10020']);
  }
};
