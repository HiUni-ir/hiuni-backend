import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import UserModel from '../models/user.model.js'
import RoleModel from '../models/role.model.js'
import ProductModel from '../models/product.model.js'

import { catchAsync } from '../utils/catch-async.util.js'

import { copyObject } from '../constants/copy-object.constant.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

import { changeRoleSchema, updateProfileSchema } from '../validations/user.validation.js'
import { ObjectIdValidator } from '../validations/public.validation.js'
import { deleteFile } from '../utils/file-system.util.js'

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
  const { id } = await ObjectIdValidator.validateAsync(req.params)
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
  const { id } = await ObjectIdValidator.validateAsync(req.params)
  const body = await changeRoleSchema.validateAsync(req.body)

  const user = await UserModel.findById(id)
  if (!user) {
    throw new createHttpError.NotFound(ResponseMessages.USER_NOT_FOUND)
  }

  // check exist role
  const role = await RoleModel.findOne({ title: body.role })
  if (!role) {
    throw new createHttpError.NotFound(ResponseMessages.ROLE_NOT_FOUND)
  }

  // update role
  const updatedResult = await UserModel.updateOne(
    { _id: id },
    { $set: { role: body.role } }
  )
  if (updatedResult.modifiedCount == 0) {
    throw new createHttpError.BadRequest(ResponseMessages.FAILED_CHANGE_ROLE)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: ResponseMessages.CHANGED_ROLE,
  })
})

/**
 * upload user profile avatar
 */
export const uploadAvatar = async (req, res, next) => {
  try {
    const { id } = await ObjectIdValidator.validateAsync(req.params)

    // check exist user
    const user = await UserModel.findById(id)
    if (!user) {
      throw new createHttpError.NotFound(ResponseMessages.USER_NOT_FOUND)
    }

    // check exist avatar file
    if (!req?.file) {
      throw new createHttpError.BadRequest(ResponseMessages.AVATAR_IS_REQUIRED)
    }

    const avatar = req?.file?.path?.replace(/\\/g, '/')
    deleteFile(user.avatar)

    // update avatar
    const updatedResult = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { avatar },
      { new: true }
    )

    if (!updatedResult) {
      throw new createHttpError.InternalServerError(ResponseMessages.FAILED_UPDATE_AVATAR)
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      avatar: updatedResult.avatar,
    })
  } catch (err) {
    if (req?.file) {
      const file = req?.file?.path?.replace(/\\/g, '/')
      deleteFile(file)
    }
    next(err)
  }
}

/**
 * add product to wishlist by productId
 */
export const addProductToWishlist = catchAsync(async (req, res) => {
  // validation product id
  const { id } = await ObjectIdValidator.validateAsync(req.params)

  // check exist prouct
  const product = await ProductModel.findById(id)
  if (!product) throw createHttpError.NotFound(ResponseMessages.PRODUCT_NOT_FOUND)

  // check exist product in wishlist
  const hasInWishlist = await UserModel.findOne({
    _id: req.user._id,
    wishlist: product._id,
  })
  if (hasInWishlist) {
    throw new createHttpError.BadRequest(ResponseMessages.PRODUCT_ALREADY_EXIST)
  }

  // add product into wishlist
  const updatedResult = await UserModel.updateOne(
    { _id: req.user._id },
    { $push: { wishlist: product._id } }
  )
  if (updatedResult.modifiedCount !== 1) {
    throw new createHttpError.InternalServerError(ResponseMessages.FAILED_ADD_TO_WISHLIST)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: ResponseMessages.PRODUCT_ADDED_TO_WISHLIST,
  })
})

/**
 * remove product from wishlist by productId
 */
export const removeProductFromWishlist = catchAsync(async (req, res) => {
  // validation product id
  const { id } = await ObjectIdValidator.validateAsync(req.params)

  // check exist prouct
  const product = await ProductModel.findById(id)
  if (!product) throw createHttpError.NotFound(ResponseMessages.PRODUCT_NOT_FOUND)

  // check exist product in wishlist
  const hasInWishlist = await UserModel.findOne({
    _id: req.user._id,
    wishlist: product._id,
  })
  if (!hasInWishlist) {
    throw new createHttpError.BadRequest(ResponseMessages.NOT_EXIST_PRODUCT_IN_WISHLIST)
  }

  // remove product into wishlist
  const updatedResult = await UserModel.updateOne(
    { _id: req.user._id },
    { $pull: { wishlist: product._id } }
  )
  if (updatedResult.modifiedCount !== 1) {
    throw new createHttpError.InternalServerError(ResponseMessages.FAILED_ADD_TO_WISHLIST)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: ResponseMessages.REMOVED_PRODUCT_FROM_WISHLIST,
  })
})

export const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await UserModel.findOne(
    { _id: req.user.id },
    { wishlist: 1 }
  ).populate('wishlist')
  if (!wishlist) {
    throw new createHttpError.InternalServerError(ResponseMessages.FAILED_GET_WISHLIST)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    wishlist: wishlist.wishlist,
  })
})
