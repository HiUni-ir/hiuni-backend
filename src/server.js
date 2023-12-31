import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import createHttpError from 'http-errors'
import swaggerUI from 'swagger-ui-express'

import { appListener, appErrorHandler, port, isDevelopment } from './config/app.config.js'
import connectDB from './config/database.config.js'
import { swaggerSetup } from './config/swagger.config.js'
import { morganMiddleware } from './middlewares/morgan.middleware.js'

import allRoutes from './routes/index.routes.js'

// Config
dotenv.config()
connectDB()

const app = express()

// Middlewares
if (isDevelopment) app.use(morganMiddleware)

app.use(express.json({ limit: 10 * 1024 * 1024 }))
app.use(express.urlencoded({ extended: true, limit: 10 * 1024 * 1024 }))
app.use('/uploads', express.static('uploads'))

// Settings
app.use('/docs', swaggerUI.serve, swaggerSetup)

// Auth
app.use(cors({ origin: '*' }))

// Routes
app.use(allRoutes)

// Error Handler
app.use('*', (req, _, next) => {
  next(createHttpError.NotFound(`Can't find ${req.originalUrl} on the server!`))
})
app.use(appErrorHandler)

// Listener
app.listen(port, appListener)
