import express, { type Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connectDB from './_core/utils/db/db.util'
import { getEnv } from './_core/config/env.config'
import { maintenanceModeMiddleware } from './_core/middlewares/maintenance-mode.middleware'

import authRoute from "./routes/auth.route";

const app: Application = express()

async function runApp () {
    const env = await getEnv();
    // Middleware
    app.use(helmet()) // Apply standard security headers
    app.use(cors({
      exposedHeaders: ['x-nodex-dt']
    })) // Enable CORS for all routes
    app.use(express.json())
  
    // Routes
    app.use(maintenanceModeMiddleware)
    app.use('/api', authRoute)
    // app.use('/api', profileRoute)
    // app.use('/api', betRoute)
    // app.use('/api', employeeRoute)
    // app.use('/api', acitvityRoute)
    // app.use('/api', configRoute)
    // app.use('/api', transactionRoute)
  
    // Connect to MongoDB
    connectDB()
  
    // Start the HTTPS server
    app.listen(Number(env?.PORT) || 5000, () => {
        console.log("@environment ", env?.ENVIRONMENT)
        console.log("@port ", Number(env?.PORT))
    });
}
  
runApp()