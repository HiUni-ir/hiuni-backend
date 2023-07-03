import JWT from 'jsonwebtoken'
import createHttpError from 'http-errors'
import UserModels from '../models/user.model.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

export const signAccessToken = userId => {
  return new Promise(async (resolve, reject) => {
    const user = await UserModels.findById(userId)

    const payload = {
      mobile: user.mobile,
    }
    const options = {
      expiresIn: '30d',
    }

    JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err)
        reject(
          createHttpError.InternalServerError(ResponseMessages.INTERNAL_SERVER_ERROR)
        )
      resolve(token)
    })
  })
}

export const signRefreshToken = userId => {
  return new Promise(async (resolve, reject) => {
    const user = await UserModels.findById(userId)

    const payload = {
      mobile: user.mobile,
    }
    const options = {
      expiresIn: '1y',
    }

    JWT.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      options,
      async (err, token) => {
        if (err)
          reject(
            createHttpError.InternalServerError(ResponseMessages.INTERNAL_SERVER_ERROR)
          )
        resolve(token)
      }
    )
  })
}

export const verifyRefreshToken = token => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err) reject(createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED))

      const user = await UserModels.findOne(
        { mobile: payload.mobile },
        { password: 0, otp: 0 }
      )
      if (!user) reject(createHttpError.Unauthorized(ResponseMessages.UNAUTHORIZED))

      resolve(payload.mobile)
    })
  })
}
