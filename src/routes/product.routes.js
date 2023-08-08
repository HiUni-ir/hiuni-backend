import express from 'express'
import { uploadFile } from '../middlewares/upload.middleware.js'
import * as productsController from '../controllers/product.controller.js'
import { stringToArray } from '../middlewares/string-to-array.middleware.js'

const router = express.Router()

router.post(
  '/',
  uploadFile.single('file'),
  stringToArray('authors'),
  productsController.createProduct
)

export default router
