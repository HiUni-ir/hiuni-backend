import express from 'express'

import authRoutes from './auth.routes.js'
import categoryRoutes from './category.routes.js'
import permissionRoutes from './permissions.routes.js'
import rolesRoutes from './roles.routes.js'
import productsRoutes from './product.routes.js'
import homeRoutes from './home.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/categories', categoryRoutes)
router.use('/permissions', permissionRoutes)
router.use('/roles', rolesRoutes)
router.use('/products', productsRoutes)
router.use(homeRoutes)

export default router
