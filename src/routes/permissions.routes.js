import express from 'express'

import {
  createPermission,
  getPermissions,
  removePermission,
  updatePermission,
} from '../controllers/permissions.controller.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'

const router = express.Router()

router.get('/', verifyAccessToken, getPermissions)
router.post('/', verifyAccessToken, createPermission)
router.patch('/:id', verifyAccessToken, updatePermission)
router.delete('/:id', verifyAccessToken, removePermission)

export default router
