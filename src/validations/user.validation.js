import Joi from 'joi'
import createHttpError from 'http-errors'
import { ResponseMessages } from '../constants/response-messages.constant.js'

export const getOtpSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.BadRequest(ResponseMessages.INVALID_MOBILE_NUMBER)),
})

export const checkOtpSchema = Joi.object({
  mobile: Joi.string()
    .length(11)
    .pattern(/^09[0-9]{9}$/)
    .error(createHttpError.Unauthorized(ResponseMessages.INVALID_MOBILE_NUMBER)),
  code: Joi.string()
    .length(6)
    .error(createHttpError.Unauthorized(ResponseMessages.INVALID_CODE)),
})
