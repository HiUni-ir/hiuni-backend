import express from 'express'

import {
  createRole,
  getRoles,
  removeRole,
  updateRole,
} from '../controllers/roles.controller.js'
import { stringToArray } from '../middlewares/string-to-array.middleware.js'
import { verifyAccessToken } from '../middlewares/authorization.middleware.js'

const router = express.Router()

router.get('/', getRoles)
router.post('/', verifyAccessToken, stringToArray('permissions'), createRole)
router.patch('/:id', verifyAccessToken, stringToArray('permissions'), updateRole)
router.delete('/:field', verifyAccessToken, removeRole)

export default router
