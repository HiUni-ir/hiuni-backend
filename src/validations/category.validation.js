import Joi from 'joi'
import createHttpError from 'http-errors'

import { MONGO_ID_PATTERN } from '../constants/regex.constant.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

export const createCategorySchema = Joi.object({
  title: Joi.string().required().error(createHttpError.BadRequest(ResponseMessages.INVALID_TITLE)),
  slug: Joi.string().required().error(createHttpError.BadRequest(ResponseMessages.INVALID_SLUG)),
  disabled: Joi.string().error(createHttpError.BadRequest(ResponseMessages.INVALID_DISABLED)),
  parent: Joi.string().pattern(MONGO_ID_PATTERN).error(createHttpError.BadRequest(ResponseMessages.INVALID_PARENT)),
})

export const updateCategorySchema = Joi.object({
  title: Joi.string().error(createHttpError.BadRequest(ResponseMessages.INVALID_TITLE)),
  slug: Joi.string().error(createHttpError.BadRequest(ResponseMessages.INVALID_SLUG)),
  disabled: Joi.string().error(createHttpError.BadRequest(ResponseMessages.INVALID_DISABLED)),
  parent: Joi.string().pattern(MONGO_ID_PATTERN).error(createHttpError.BadRequest(ResponseMessages.INVALID_PARENT)),
})
