import express from 'express'
import { uploadFile } from '../middlewares/upload.middleware.js'
import * as productsController from '../controllers/product.controller.js'
import { stringToArray } from '../middlewares/string-to-array.middleware.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'

const router = express.Router()

router.post(
  '/',
  verifyAccessToken,
  uploadFile.single('file'),
  stringToArray('authors'),
  productsController.createProduct
)

router.patch(
  '/:id',
  verifyAccessToken,
  uploadFile.single('file'),
  stringToArray('authors'),
  productsController.updateProduct
)

router.get('/', productsController.getProductList)
router.get('/:id', productsController.getSingleProduct)

export default router
