import { type Request, type Response } from 'express';
import Profile from '../models/profile.model';
import { validateCreateProfile } from '../_core/validators/user.validator';
import { statuses } from '../_core/const/api.statuses';
import { IAuthValue } from '../_core/interfaces/jwt.interface';
import { emitter } from '../_core/events/activity.event';
import { ActivityType, EventName } from '../_core/enum/activity.enum';
import { IActivity } from '../_core/interfaces/activity.interface';

// Create a controller function to handle POST requests for creating profiles
export const createProfile = async (req: Request & { user: IAuthValue }, res: Response) => {
  try {
    // Check if there are any validation errors
    const error = validateCreateProfile(req.body);
    if (error) {
      return res.status(400).json({
        ...statuses['501'],
        error: error.details[0].message.replace(/['"]/g, ''),
      });
    }

    // Extract data from the request body
    const { firstName, lastName, birthdate, address, contact, gender } = req.body;

    // Create a new Profile instance with the extracted data
    const newProfile = new Profile({
      user: req.user.value.id,
      firstName,
      lastName,
      birthdate,
      address,
      contact,
      gender,
    });

    // Save the new profile to the database
    const savedProfile = await newProfile.save();

    emitter.emit(EventName.ACTIVITY, {
      user: req.user.value.id as any,
      description: ActivityType.PROFILE_CREATED,
    } as IActivity);

    // Return the saved profile as a response
    return res.status(201).json(savedProfile);
  } catch (error) {
    console.log('@createProfile error', error);
    return res.status(401).json(statuses['0900']);
  }
};
