// request-logger.middleware.ts

import { type Request, type Response, type NextFunction } from 'express';
import { emitter } from '../events/activity.event';
import { EventName } from '../enum/activity.enum';
import { IRequestLog } from '../interfaces/schema/schema.interface';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Get client IP address from headers (use a more accurate method if needed)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const timestamp = new Date().toISOString();
    const requestMethod = req.method;
    const requestUrl = req.url;
    const userAgent = req.headers['user-agent'];

    // Log the request method, URL, client IP, timestamp, user agent, and request body
    console.log(`[${timestamp}] ${clientIp} - ${requestMethod} ${requestUrl}`);
    console.log(`User Agent: ${userAgent}`);
    console.log('Request Body:', req.body); // Log the request body (if present)

    // Continue processing the request
    next();

    // Log the response status and elapsed time
    const elapsed = Date.now() - start;
    const responseStatus = res.statusCode || 500;
    const responseStatusMessage = res.statusMessage || 'Unknown';

    console.log(`[${timestamp}] ${clientIp} - ${responseStatus} ${responseStatusMessage} (${elapsed} ms)`);


    emitter.emit(EventName.NETWORK_ACTIVITY, {
        clientIp,
        timestamp,
        requestMethod,
        requestUrl,
        userAgent,
        requestBody: req.body,
        responseStatus,
        responseStatusMessage,
        elapsed
    } as unknown as IRequestLog);
};