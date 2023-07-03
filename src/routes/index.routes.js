import express from 'express'

import authRoutes from './auth.routes.js'
import homeRoutes from './home.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use(homeRoutes)

export default router
