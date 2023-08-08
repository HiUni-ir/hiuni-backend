import Joi from 'joi'
import { MONGO_ID_PATTERN } from '../constants/regex.constant.js'

export const createProductValidation = Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().lowercase().required(),
  description: Joi.string().required(),
  lessonCode: Joi.string().required(),
  authors: Joi.array().items(Joi.string()).required(),
  publisher: Joi.string().required(),
  publishYear: Joi.string().required(),
  category: Joi.string()
    .pattern(MONGO_ID_PATTERN)
    .required()
    .error(new Error('category should be objectId')),
})
