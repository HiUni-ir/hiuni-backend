import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import UserModel from '../models/user.model.js'
import RoleModel from '../models/role.model.js'

import { catchAsync } from '../utils/catch-async.util.js'

import { copyObject } from '../constants/copy-object.constant.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'
import { changeRoleSchema, updateProfileSchema } from '../validations/user.validation.js'
import { ObjectIdValidator } from '../validations/public.validation.js'

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

export const getUsers = catchAsync(async (req, res) => {
  const page = +req.query.page || 1
  const limit = +req.query.limit || 10
  const search = req.query.search

  const users = await UserModel.find(search ? { $text: { $search: search } } : {}, {
    otp: 0,
  })
    .skip((page - 1) * limit)
    .limit(limit)

  if (!users) {
    throw new createHttpError.Unauthorized(ResponseMessages.FAILED_GET_USERS)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    users,
  })
})

export const updateProfile = catchAsync(async (req, res) => {
  const { id } = ObjectIdValidator.validateAsync(req.params)
  const body = await updateProfileSchema.validateAsync(req.body)

  const query = body?.mobile ? { ...body, verifiedMobile: false } : body
  const updatedResult = await UserModel.updateOne({ _id: id }, { $set: query })
  if (updatedResult.modifiedCount == 0) {
    throw new createHttpError.BadRequest(ResponseMessages.FAILED_UPDATE_PROFILE)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: ResponseMessages.UPDATED_PROFILE,
  })
})

/**
 * change user role
 */
export const changeRole = catchAsync(async (req, res) => {
  const { id } = ObjectIdValidator.validateAsync(req.params)
  const body = await changeRoleSchema.validateAsync(req.body)

  const user = await UserModel.findById(id)
  if (!user) {
    throw new createHttpError.NotFound(ResponseMessages.USER_NOT_FOUND)
  }

  // check exist role
  const role = await RoleModel.findOne({ name: body.role })
  if (!role) {
    throw new createHttpError.NotFound(ResponseMessages.ROLE_NOT_FOUND)
  }

  // update role
  const updatedResult = await UserModel.updateOne({ _id: id }, { $set: { role } })
  if (updatedResult.modifiedCount == 0) {
    throw new createHttpError.BadRequest(ResponseMessages.FAILED_CHANGE_ROLE)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: ResponseMessages.CHANGED_ROLE,
  })
})
