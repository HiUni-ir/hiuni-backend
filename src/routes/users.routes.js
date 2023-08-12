import express from 'express'
import * as usersController from '../controllers/users.controller.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'

const router = express.Router()

router.get('/@me', verifyAccessToken, usersController.getMe)
router.get('/', verifyAccessToken, usersController.getUsers)

export default router
