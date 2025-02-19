import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';

import { connectDB } from './_core/utils/db/db.util';
import { getEnv } from './_core/config/env.config';
import { maintenanceModeMiddleware } from './_core/middlewares/maintenance-mode.middleware';

import { requestLoggerMiddleware } from './_core/middlewares/request-logger.middleware';
import { allowApiAccessMiddleware } from './_core/middlewares/allow-access.middleware';
import { fileFilter, storage } from './_core/services/upload/image_upload.service';

import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import uploadRoute from './routes/upload.route';
import auxiliaryRoute from './routes/auxiliary.route';

import {
  logNetworBody,
  logNetworkHeaders,
  logNetworkRequests,
  setDefaultDateTime,
} from './_core/middlewares/default.middleware';
import { colors } from './_core/const/common.const';
import { swaggerSetup } from './swagger/swagger';

const app: Application = express();

/**
 * Runs the application by setting up middleware and routes, connecting to MongoDB, and starting the HTTPS server.
 *
 * @return {Promise<void>} A promise that resolves when the application has started.
 */
async function runApp(): Promise<void> {
  const env = await getEnv();
  // Middleware
  app.use(helmet()); // Apply standard security headers
  app.use(
    cors({
      origin: 'http://localhost:3432',
      exposedHeaders: ['X-Nodex-DateTime'],
    }),
  );

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(setDefaultDateTime);
  app.use(requestLoggerMiddleware);
  app.use(multer({ storage, fileFilter }).array('media'));

  app.get('/', (_, res) => {
    return res.status(200).json({ message: 'ok' });
  });

  app.use(allowApiAccessMiddleware);
  app.use(maintenanceModeMiddleware);
  app.use(logNetworkRequests);
  app.use(logNetworkHeaders);
  app.use(logNetworBody);

  // Routes
  app.use('/api', authRoute);
  app.use('/api', userRoute);
  app.use('/api', uploadRoute);
  app.use('/api', auxiliaryRoute);

  swaggerSetup(app);

  // Connect to MongoDB
  connectDB();

  // Start the HTTPS server
  app.listen(Number(env?.PORT) || 5000, () => {
    console.log(`${colors.fg.cyan}[application] @environment `, env?.ENVIRONMENT);
    console.log(`${colors.fg.cyan}[application] @port `, Number(env?.PORT));
    console.log(`${colors.fg.cyan}[application] @url `, `http://localhost:${Number(env?.PORT)}`);
  });
}

runApp();
