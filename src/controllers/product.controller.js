import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import {
  createProductValidation,
  getProductLis,
  updateProductValidation,
} from '../validations/product.validation.js'
import ProductModel from '../models/product.model.js'
import { deleteFile } from '../utils/file-system.util.js'
import { catchAsync } from '../utils/catch-async.util.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'
import { ObjectIdValidator } from '../validations/public.validation.js'

/**
 * create product
 */
export const createProduct = async (req, res, next) => {
  try {
    const { error, value } = createProductValidation.validate(req.body)
    if (error) {
      throw new createHttpError.BadRequest(error.message.replace(/(\"|\[|\d\])/g, ''))
    }

    if (!req?.file) {
      throw createHttpError.BadRequest(ResponseMessages.FILE_IS_REQUIRE)
    }

    const source = req?.file?.path?.replace(/\\/g, '/')

    const existSlug = await ProductModel.findOne({ slug: value.slug })
    if (existSlug) throw createHttpError.BadRequest(ResponseMessages.SLUG_ALREADY_EXISTED)

    const product = await ProductModel.create({ ...value, source })
    if (!product) {
      throw createHttpError.InternalServerError(ResponseMessages.FAILED_CREATE_PRODUCT)
    }

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      product,
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
 * update product by ID
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = await ObjectIdValidator.validateAsync(req.params)
    if (!req?.body?.authors) req.body.authors = []

    const { error, value } = updateProductValidation.validate(req.body)
    if (error) {
      throw new createHttpError.BadRequest(error.message.replace(/(\"|\[|\d\])/g, ''))
    }

    const existProduct = await ProductModel.findById(id)
    if (!existProduct)
      throw createHttpError.BadRequest(ResponseMessages.PRODUCT_NOT_FOUND)

    if (req?.file) {
      const source = req?.file?.path?.replace(/\\/g, '/')
      value.source = source
      deleteFile(existProduct?.source)
    }

    const existSlug = await ProductModel.findOne({ slug: value.slug })
    if (existSlug) throw createHttpError.BadRequest(ResponseMessages.SLUG_ALREADY_EXISTED)

    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: id },
      { ...value },
      {
        new: true,
        runValidators: true,
      }
    )
    if (!updatedProduct) {
      throw createHttpError.InternalServerError(ResponseMessages.FAILED_UPDATE_PRODUCT)
    }

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      product: updatedProduct,
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
 * get single product by ID
 */
export const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = await ObjectIdValidator.validateAsync(req.params)

  const product = await ProductModel.findById(id)
  if (!product) {
    throw createHttpError.NotFound(ResponseMessages.PRODUCT_NOT_FOUND)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    product,
  })
})

/**
 * get product list
 */
export const getProductList = catchAsync(async (req, res) => {
  const page = +req.query.page || 1
  const limit = +req.query.limit || 10
  const search = req.query.search

  const products = await ProductModel.find(search ? { $text: { $search: search } } : {})
    .skip((page - 1) * limit)
    .limit(limit)

  if (!products) {
    throw createHttpError.NotFound(ResponseMessages.FAILED_GET_PRODUCT)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    products,
  })
})

/**
 * get newest product list
 */
export const getNewestProductList = catchAsync(async (req, res) => {
  const { error, value } = getProductLis.validate(req.query)
  if (error) {
    throw new createHttpError.BadRequest(error.message.replace(/(\"|\[|\d\])/g, ''))
  }

  const page = value?.page || 1
  const limit = value?.limit || 10
  const search = value?.search

  const products = await ProductModel.find(search ? { $text: { $search: search } } : {})
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)

  if (!products) {
    throw createHttpError.NotFound(ResponseMessages.FAILED_GET_PRODUCT)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    products,
  })
})
