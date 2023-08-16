// modules
import axios from 'axios'
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

/**
 * Get otp code (send sms otp code)
 */
export const getOtp = catchAsync(async (req, res) => {
  const { mobile } = req.body

  await getOtpSchema.validateAsync(req.body)
  const code = generateRandomNumber()

  const result = await saveUser(mobile, code)
  if (!result) throw createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED)

  await sendOtpSms(mobile, code)

  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    success: true,
    message: ResponseMessages.CODE_SENT_FOR_YOU,
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

  const updateResult = await UserModel.updateOne(
    { _id: user._id },
    { $set: { accessToken, refreshToken, verifiedMobile: true } }
  )
  if (updateResult.modifiedCount == 0) {
    throw new createHttpError.InternalServerError(ResponseMessages.FAILED_UPDATE_USER)
  }

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
  if (!user) {
    throw new createHttpError.NotFound(ResponseMessages.USER_NOT_FOUND)
  }

  const accessToken = await signAccessToken(user._id)
  const newRefreshToken = await signRefreshToken(user._id)

  const updateResult = await UserModel.updateOne(
    { _id: user._id },
    { $set: { accessToken, refreshToken: newRefreshToken } }
  )
  if (updateResult.modifiedCount == 0) {
    throw new createHttpError.InternalServerError(ResponseMessages.FAILED_UPDATE_USER)
  }

  return res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    accessToken,
    refreshToken: newRefreshToken,
  })
})

/**
 * send sms otp code to user
 */
export const sendOtpSms = async (mobile, code) => {
  try {
    const apiKey = process.env.IPPANEL_API_KEY
    const apiUrl = process.env.IPPANEL_API_URL
    const pattern_code = process.env.IPPANEL_PATTERN

    const data = {
      pattern_code,
      originator: '+985000404223',
      recipient: mobile,
      values: {
        'verification-code': String(code),
      },
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `AccessKey ${apiKey}`,
      },
    }

    await axios
      .post(apiUrl, data, config)
      .then(res => console.log(res))
      .catch(err => console.log(err.response.data))
  } catch (error) {
    throw new createHttpError.InternalServerError(ResponseMessages.FAILED_SEND_OTP_SMS)
  }
}
