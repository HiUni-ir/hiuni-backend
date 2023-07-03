import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import CategoryModel from '../models/category.model.js'
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validations/category.validation.js'
import { ObjectIdValidator } from '../validations/public.validation.js'

import { ResponseMessages } from '../constants/response-messages.constant.js'
import { catchAsync } from '../utils/catch-async.util.js'

/**
 * Create new category
 */
export const createCategory = catchAsync(async (req, res) => {
  const { title, slug, disabled, parent } = await createCategorySchema.validateAsync(
    req.body
  )

  const existCategory = await CategoryModel.findOne({ title })
  if (existCategory)
    throw createHttpError.BadRequest(ResponseMessages.CATEGORY_ALREADY_EXISTS)

  const newCategory = await CategoryModel.create({ title, slug, disabled, parent })
  if (!newCategory)
    throw createHttpError.InternalServerError(ResponseMessages.FAILED_CREATE_CATEGORY)

  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    success: true,
    message: ResponseMessages.CREATED_CATEGORY,
  })
})

/**
 * Update category by ID
 */
export const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params

  const { _id } = await checkExistCategory(id)

  const categoryDataBody = await updateCategorySchema.validateAsync(req.body)
  const { slug, title } = categoryDataBody

  const existCategory = await CategoryModel.findOne({
    $or: [{ slug }, { title }],
  })
  if (existCategory)
    throw createHttpError.BadRequest(ResponseMessages.CATEGORY_ALREADY_EXISTS)

  const updatedResult = await CategoryModel.updateOne({ _id }, { $set: categoryDataBody })
  if (updatedResult.modifiedCount == 0) {
    throw createHttpError.InternalServerError(ResponseMessages.FAILED_UPDATED_CATEGORY)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: ResponseMessages.UPDATED_CATEGORY,
  })
})

/**
 * Remove category by ID
 */
export const removeCategory = catchAsync(async (req, res) => {
  const { id } = req.params
  const { _id } = await checkExistCategory(id)

  const deletedCategory = await CategoryModel.deleteOne({ _id })
  if (!deletedCategory.deletedCount === 0) {
    throw createHttpError.InternalServerError(ResponseMessages.FAILED_DELETE_CATEGOR)
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: ResponseMessages.DELETED_CATEGORY,
  })
})

export const getCategories = catchAsync(async (req, res) => {
  const categories = await CategoryModel.find({ parent: undefined })

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    data: {
      categories,
    },
  })
})

// Check exist category by ID
const checkExistCategory = async categoryId => {
  const { id } = await ObjectIdValidator.validateAsync({ id: categoryId })
  const category = await CategoryModel.findById(id)
  console.log({ category })
  if (!category) throw createHttpError.NotFound(ResponseMessages.CATEGORY_NOT_FOUND)
  return category
}
