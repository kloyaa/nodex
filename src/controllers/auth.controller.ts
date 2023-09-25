import { type Request, type Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { statuses } from '../_core/const/api.statuses'
import { validateLogin } from '../_core/validators/auth.validator'
import { IUser } from '../_core/interfaces/schema/schema.interface'

import User from '../models/user.model'
import { emitter } from '../_core/events/activity.event'
import { ActivityType, EventName } from '../_core/enum/activity.enum'
import { IActivity } from '../_core/interfaces/activity.interface'

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
      // Check if there are any validation errors
      const error = validateLogin(req.body)
      if (error) {
        return res.status(400).json({
          ...statuses['501'],
          error: error.details[0].message.replace(/['"]/g, '')
        })
      }

      const { username, password } = req.body;
      
      const user: IUser | null = await User
        .findOne({ $or: [{ username }, { email: username }] })
        .exec();

      if (!user) {
        res.status(401).json(statuses['0051'])
        return
      }

      const passwordMatched: boolean = await bcrypt.compare(password, user.password)
      if (!passwordMatched) {
        // Incorrect password
        return res.status(401).json(statuses['0051'])
      }

      // emitter.emit(EventName.ACTIVITY, {
      //   user: user.id,
      //   description: ActivityType.LOGIN
      // } as IActivity)

      return res.status(200).json({
        ...statuses['00'],
        data: null
      });

    } catch (error) {
      console.log('@login error', error)
      return res.status(401).json(statuses['0900'])
    }
}