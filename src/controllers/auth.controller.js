// modules
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
// models
import UserModel from '../models/user.model.js'
// validations
import { checkOtpSchema, getOtpSchema } from '../validations/user.validation.js'
// utils
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/token-util.js'
import { catchAsync } from '../utils/catch-async.util.js'
import { generateRandomNumber } from '../utils/generate-number.util.js'
// constants
import { ROLES } from '../constants/RBACK.constant.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

export const getOtp = catchAsync(async (req, res) => {
  const { mobile } = req.body

  await getOtpSchema.validateAsync(req.body)
  const code = generateRandomNumber()

  const result = await saveUser(mobile, code)
  if (!result) throw createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED)

  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    success: true,
    data: {
      code,
      mobile,
    },
  })
})

const saveUser = async (mobile, code) => {
  const otp = {
    code,
    expiresIn: new Date().getTime() + 120000,
  }
  const existUserResult = await checkExistUser(mobile)
  if (existUserResult) return await updateUser(mobile, { otp })

  return !!(await UserModel.create({
    mobile,
    otp,
    role: ROLES.STUDENT,
  }))
}

const checkExistUser = async mobile => {
  const user = await UserModel.findOne({ mobile })
  return !!user
}

const updateUser = async (mobile, objectData) => {
  const nullish = ['', ' ', 0, '0', null, undefined, NaN]
  Object.keys(objectData).map(key => {
    if (nullish.includes(objectData[key])) delete objectData[key]
  })
  const updateResult = await UserModel.updateOne({ mobile }, { $set: objectData })
  return !!updateResult.modifiedCount
}

export const checkOtp = catchAsync(async (req, res) => {
  const { mobile, code } = req.body

  await checkOtpSchema.validateAsync(req.body)

  const user = await UserModel.findOne({ mobile })
  if (!user) throw createHttpError.NotFound(ResponseMessages.USER_NOT_FOUND)

  const now = Date.now()
  if (user.otp.code != code)
    throw createHttpError.Unauthorized(ResponseMessages.CODE_SENT_IS_NOT_CORRECT)
  if (+user.otp.expiresIn < now)
    throw createHttpError.Unauthorized(ResponseMessages.YOUR_CODE_EXPIRED)

  const accessToken = await signAccessToken(user._id)
  const refreshToken = await signRefreshToken(user._id)

  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    success: true,
    data: {
      accessToken,
      refreshToken,
    },
  })
})

export const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body

  const mobile = await verifyRefreshToken(refreshToken)
  const user = await UserModel.findOne({ mobile })

  const accessToken = await signAccessToken(user._id)
  const newRefreshToken = await signRefreshToken(user._id)

  return res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    accessToken,
    refreshToken: newRefreshToken,
  })
})
