import createHttpError from 'http-errors'
import { catchAsync } from '../utils/catch-async.util.js'
import { createProductValidation } from '../validations/product.validation.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'
import ProductModel from '../models/product.model.js'
import { StatusCodes } from 'http-status-codes'

export const createProduct = catchAsync(async (req, res) => {
  const { error, value } = createProductValidation.validate(req.body)
  if (error) {
    throw new createHttpError.BadRequest(error.message.replace(/(\"|\[|\d\])/g, ''))
  }

  if (!req?.file) {
    throw createHttpError.BadRequest(ResponseMessages.FILE_IS_REQUIRE)
  }

  const file = req?.file?.path?.replace(/\\/g, '/')

  const existSlug = await ProductModel.findOne({ slug })
  if (existSlug) throw createHttpError.BadRequest(ResponseMessages.SLUG_ALREADY_EXISTED)

  const product = await ProductModel.create({ ...value, file })
  if (!product) {
    throw createHttpError.InternalServerError(ResponseMessages.FAILED_CREATE_PRODUCT)
  }

  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    success: true,
    product,
  })
})
