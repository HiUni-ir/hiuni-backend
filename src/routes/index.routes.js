import express from 'express'

import authRoutes from './auth.routes.js'
import categoryRoutes from './category.routes.js'
import homeRoutes from './home.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/categories', categoryRoutes)
router.use(homeRoutes)

export default router
