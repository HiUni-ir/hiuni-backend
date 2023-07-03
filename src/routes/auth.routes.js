import express from 'express'
import { checkOtp, getOtp, refreshToken } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/get-otp', getOtp)
router.post('/check-otp', checkOtp)
router.post('/refresh-token', refreshToken)

export default router
