import express from 'express'
import * as usersController from '../controllers/users.controller.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'

const router = express.Router()

router.get('/@me', verifyAccessToken, usersController.getMe)

export default router
