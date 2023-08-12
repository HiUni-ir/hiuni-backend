import express from 'express'
import * as usersController from '../controllers/users.controller.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'

const router = express.Router()

router.get('/@me', verifyAccessToken, usersController.getMe)
router.get('/', verifyAccessToken, usersController.getUsers)
router.patch('/:id', verifyAccessToken, usersController.updateProfile)
router.patch('/change-role/:id', verifyAccessToken, usersController.changeRole)

export default router
