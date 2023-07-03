import express from 'express'
import * as categoryControllers from '../controllers/category.controller.js'

const router = express.Router()

router.post('/', categoryControllers.createCategory)

export default router
