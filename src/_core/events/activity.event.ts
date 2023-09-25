import EventEmitter from 'eventemitter3';
import { EventName } from '../enum/activity.enum';
import { IActivity } from '../interfaces/activity.interface';
import Activity  from '../../models/activity.model';

// Create an EventEmitter instance
export const emitter = new EventEmitter();

// Event listener for 'login-activity' event
emitter.on(EventName.ACTIVITY, async (payload: IActivity) => {
    try {
        // Create a new Activity document
        const newActivity = new Activity({
            user: payload.user,
            description: payload.description,
        } as IActivity);

        // Save the new activity log to the database
        await newActivity.save();
    } catch (error) {
        console.error(`@${EventName.ACTIVITY} error`, error);
    }
});