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
