import express from 'express'
import * as usersController from '../controllers/users.controller.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'
import { uploadPicture } from '../middlewares/upload.middleware.js'

const router = express.Router()

router.get('/@me', verifyAccessToken, usersController.getMe)
router.get('/', verifyAccessToken, usersController.getUsers)
router.patch('/:id', verifyAccessToken, usersController.updateProfile)
router.patch('/change-role/:id', verifyAccessToken, usersController.changeRole)
router.patch(
  '/upload-avatar/:id',
  verifyAccessToken,
  uploadPicture.single('avatar'),
  usersController.uploadAvatar
)
router.patch('/wishlist/add/:id', verifyAccessToken, usersController.addProductToWishlist)
router.patch(
  '/wishlist/remove/:id',
  verifyAccessToken,
  usersController.removeProductFromWishlist
)
router.get('/wishlist', verifyAccessToken, usersController.getWishlist)

export default router
