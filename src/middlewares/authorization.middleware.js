import JWT from 'jsonwebtoken'
import createHttpError from 'http-errors'

import UserModels from '../models/user.model.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

export const verifyAccessToken = (req, res, next) => {
  try {
    if (!req.headers?.authorization) {
      return next(createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED))
    }

    const [bearer, token] = req.headers?.authorization?.split(' ')
    const validData = ['Bearer', 'bearer']

    if (!token || !validData.includes(bearer)) {
      return next(createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED))
    }

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, async (err, paylod) => {
      if (err) return next(createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED))

      const user = await UserModels.findOne({ email: paylod.email }, { password: 0 })
      if (!user) return next(createHttpError.NotFound(ResponseMessages.USER_NOT_FOUND))

      req.user = user
      return next()
    })
  } catch (err) {
    next(err)
  }
}
