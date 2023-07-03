import express from 'express'
import * as categoryControllers from '../controllers/category.controller.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'

const router = express.Router()

router.get('/', categoryControllers.getCategories)
router.post('/', verifyAccessToken, categoryControllers.createCategory)
router.put('/:id', verifyAccessToken, categoryControllers.updateCategory)
router.delete('/:id', verifyAccessToken, categoryControllers.removeCategory)

export default router
