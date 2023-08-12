import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import UserModel from '../models/user.model.js'
import { catchAsync } from '../utils/catch-async.util.js'
import { copyObject } from '../constants/copy-object.constant.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

export const getMe = catchAsync(async (req, res) => {
  const checkExistUser = req?.user
  if (!checkExistUser) {
    throw new createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED)
  }

  const user = copyObject(checkExistUser)
  delete user.otp

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    user,
  })
})
