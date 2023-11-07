import bcrypt from 'bcrypt';
import { type Request, type Response } from 'express';
import { statuses } from '../_core/const/api.statuses';
import { validateLogin, validateRegister } from '../_core/validators/auth.validator';
import { emitter } from '../_core/events/activity.event';
import { ActivityType, EventName } from '../_core/enum/activity.enum';
import { IActivity } from '../_core/interfaces/activity.interface';
import { generateJwt } from '../_core/utils/jwt/jwt.util';
import { getEnv } from '../_core/config/env.config';

import User from '../models/user.model';

export const login = async (req: Request & { from: any }, res: Response): Promise<any> => {
  try {
    const error = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, ''),
      });
    }

    const { username, password } = req.body;

    const user = await User.findOne()
      .or([{ username }, { email: username }])
      .exec();

    if (!user) {
      res.status(401).json(statuses['0051']);
      return;
    }

    const passwordMatched: boolean = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(401).json(statuses['0051']);
    }

    emitter.emit(EventName.ACTIVITY, {
      user: user.id,
      description: ActivityType.LOGIN,
    } as IActivity);

    const env = await getEnv();

    return res.status(200).json({
      ...statuses['00'],
      data: await generateJwt(
        {
          origin: req.from,
          id: user.id,
        },
        env.JWT_SECRET_KEY || '123_secretkey',
      ),
    });
  } catch (error) {
    console.log('@login error', error);
    return res.status(401).json(statuses['0900']);
  }
};

export const register = async (req: Request & { from: any }, res: Response): Promise<any> => {
  try {
    const error = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, ''),
      });
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne().or([{ username }, { email }]).exec();
    if (existingUser) {
      return res.status(401).json(statuses['0052']);
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      salt,
    });

    const createdUser = await newUser.save();

    emitter.emit(EventName.ACTIVITY, {
      user: createdUser.id,
      description: ActivityType.REGISTRATION_SUCCESS,
    } as IActivity);

    const env = await getEnv();

    return res.status(201).json({
      ...statuses['0050'],
      data: await generateJwt(
        {
          id: createdUser.id,
          origin: req.from,
        },
        env.JWT_SECRET_KEY || '123_secretkey',
      ),
    });
  } catch (error) {
    console.log('@register error', error);
    return res.status(401).json(statuses['0900']);
  }
};
