import Joi from 'joi'
import createHttpError from 'http-errors'

import { MONGO_ID_PATTERN } from '../constants/regex.constant.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

export const ObjectIdValidator = Joi.object({
  id: Joi.string()
    .pattern(MONGO_ID_PATTERN)
    .error(createHttpError.BadRequest(ResponseMessages.INVALID_ID)),
})

export const SlugValidator = Joi.object({
  slug: Joi.string().error(createHttpError.BadRequest(ResponseMessages.INVALID_SLUG)),
})
