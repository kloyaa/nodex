import bcrypt from 'bcrypt';
import { type Request, type Response } from 'express';
import { statuses } from '../_core/const/api.statuses';
import { validateChangePassword, validateLogin, validateRegister } from '../_core/validators/auth.validator';
import { emitter } from '../_core/events/activity.event';
import { ActivityType, EventName } from '../_core/enum/activity.enum';
import { IActivity } from '../_core/interfaces/activity.interface';
import { generateJwt } from '../_core/utils/jwt/jwt.util';
import { getEnv } from '../_core/config/env.config';

import { Password, User } from '../schema/user.schema';
import { encrypt } from '../_core/utils/security/encryption.util';
import { TRequest } from '../_core/interfaces/overrides.interface';
import { findLastChangePassActivityByUser, isPasswordAlreadyUsed } from '../_core/services/user/user.service';
import { toObjectId } from '../_core/utils/odm';

export const login = async (req: TRequest, res: Response): Promise<any> => {
  const error = validateLogin(req.body);
  if (error) {
    return res.status(400).json({
      ...statuses['501'],
      message: error.details[0].message.replace(/['"]/g, ''),
    });
  }

  try {
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
    const payload = { origin: req.headers['nodex-user-origin'], id: user.id }
    const encryptedPayload = encrypt(payload, env.NODEX_CRYPTO_KEY ?? "123_cryptoKey")

    return res.status(200).json({
      ...statuses['00'],
      data: await generateJwt(
        encryptedPayload,
        env.JWT_SECRET_KEY || '123_secretKey',
      ),
    });
  } catch (error) {
    console.log('@login error', error);
    return res.status(401).json(statuses['0900']);
  }
};

export const register = async (req: TRequest, res: Response): Promise<any> => {
  const error = validateRegister(req.body);
  if (error) {
    return res.status(400).json({
      ...statuses['501'],
      message: error.details[0].message.replace(/['"]/g, ''),
    });
  }

  try {
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
    const payload = { origin: req.headers['nodex-user-origin'], id: createdUser.id }
    const encryptedPayload = encrypt(payload, env.NODEX_CRYPTO_KEY ?? "123_cryptoKey")

    return res.status(201).json({
      ...statuses['0050'],
      data: await generateJwt(
        encryptedPayload,
        env.JWT_SECRET_KEY || '123_secretkey',
      ),
    });

  } catch (error) {
    console.log('@register error', error);
    return res.status(401).json(statuses['0900']);
  }
};

export const changeUserPassword = async (req: TRequest, res: Response) => {
  const error = validateChangePassword(req.body);
  if (error) {
    return res.status(400).json({
      ...statuses['501'],
      message: error.details[0].message.replace(/['"]/g, ''),
    });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json(statuses['0056']);
    }

    const passwordMatched: boolean = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatched) {
      return res.status(403).json(statuses['0063']);
    }

    if (currentPassword === newPassword) {
      return res.status(403).json(statuses['0064']);
    }

    const _isPasswordAlreadyUsed = await isPasswordAlreadyUsed(toObjectId(req.user.id), newPassword);
    if(_isPasswordAlreadyUsed) {
      return res.status(403).json(statuses['0065']);
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const savePassword = new Password({
      user: req.user.id,
      password: hashedPassword
    });

    await Promise.all([
      User.findByIdAndUpdate(req.user.id,
        { password: hashedPassword },
        { new: true }
      ),
      savePassword.save()
    ]);

    emitter.emit(EventName.ACTIVITY, {
      user: user.id,
      description: ActivityType.CHANGE_PASSWORD,
    } as IActivity);

    return res.status(200).json(statuses["00"]);
  } catch (error) {
    console.log('@updateUserPassword error', error);
    return res.status(500).json(statuses['0900']);
  }
}