import express from 'express'
import * as categoryControllers from '../controllers/category.controller.js'

const router = express.Router()

router.get('/', categoryControllers.getCategories)
router.post('/', categoryControllers.createCategory)
router.put('/:id', categoryControllers.updateCategory)
router.delete('/:id', categoryControllers.removeCategory)

export default router
