import { type Response } from 'express';
import Profile from '../schema/profile.schema';
import { validateCreateProfile } from '../_core/validators/user.validator';
import { statuses } from '../_core/const/api.statuses';
import { emitter } from '../_core/events/activity.event';
import { ActivityType, EventName } from '../_core/enum/activity.enum';
import { IActivity } from '../_core/interfaces/activity.interface';
import { TRequest } from '../_core/interfaces/overrides.interface';
import { formatDate } from '../_core/utils/utils';
import { findLastChangePassActivityByUser, findLastLoginByUser } from '../_core/services/user/user.service';
import { toObjectId } from '../_core/utils/odm';

export const createProfile = async (req: TRequest, res: Response) => {
  const error = validateCreateProfile(req.body);
  if (error) {
    return res.status(400).json({
      ...statuses['501'],
      message: error.details[0].message.replace(/['"]/g, ''),
    });
  }

  try {
    const { firstName, lastName, birthdate, middleName, address, contact, gender } = req.body;
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      return res.status(400).json(statuses['0103']);
    }

    const newProfile = new Profile({
      user: req.user.id,
      firstName,
      lastName,
      birthdate,
      address,
      contact,
      gender,
      middleName,
    });

    const savedProfile = await newProfile.save();

    emitter.emit(EventName.ACTIVITY, {
      user: req.user.id as any,
      description: ActivityType.PROFILE_CREATED,
    } as IActivity);

    // Return the saved profile as a response
    return res.status(201).json(savedProfile);
  } catch (error) {
    console.log('@createProfile error', error);
    return res.status(401).json(statuses['0900']);
  }
};

export const getProfileByAccessToken = async (req: TRequest, res: Response) => {
  try {
    const user = req.user.id;
    const result: any = await Profile.findOne({ user }).exec();

    if (!result) {
      return res.status(404).json(statuses['02']);
    }

    const _findLastChangePassActivityByUser = await findLastChangePassActivityByUser(toObjectId(user));
    const _findLastLoginByUser = await findLastLoginByUser(toObjectId(user));

    return res.status(200).json({
      ...result._doc,
      others: {
        lastLogin: _findLastLoginByUser ? formatDate(_findLastLoginByUser) : 'N/A',
        lastChangePassword: _findLastChangePassActivityByUser ? formatDate(_findLastChangePassActivityByUser) : 'N/A',
      },
    });
  } catch (error) {
    console.log('@getProfileByAccessToken error', error);
    return res.status(401).json(statuses['0900']);
  }
};
