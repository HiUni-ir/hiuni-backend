import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

import RoleModel from '../models/role.model.js'
import { createRoleSchema, updateRoleSchema } from '../validations/RBAC.validation.js'
import { ResponseMessages } from '../constants/response-messages.constant.js'

/**
 * Get all roles
 */
export const getRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.find()

    if (!roles) {
      throw createHttpError.InternalServerError(ResponseMessages.FAILED_GET_ROLES)
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      roles,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Create new role
 */
export const createRole = async (req, res, next) => {
  try {
    if (!req?.body?.permissions) req.body.permissions = []
    const { title, description, permissions } = await createRoleSchema.validateAsync(
      req.body
    )

    const role = await RoleModel.findOne({ title })
    if (role) throw createHttpError.BadRequest(ResponseMessages.ROLE_ALREADY_EXISTED)

    const roleResult = await RoleModel.create({ title, description, permissions })
    if (!roleResult)
      throw createHttpError.InternalServerError(ResponseMessages.ROLE_WAS_NOT_GRANTED)

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: ResponseMessages.CREATED_ROLE,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Update role by ID
 */
export const updateRole = async (req, res, next) => {
  const { id } = req.params
  try {
    const { _id } = await findRoleWithIdOrTitle(id)

    if (!req?.body?.permissions) req.body.permissions = []
    const roleDataBody = await updateRoleSchema.validateAsync(req.body)

    const updateRoleResult = await RoleModel.updateOne({ _id }, { $set: roleDataBody })

    if (!updateRoleResult.modifiedCount) {
      throw createHttpError.InternalServerError(ResponseMessages.FAILED_UPDATE_ROLE)
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: ResponseMessages.UPDATED_ROLE,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Remove role with Id or title
 */
export const removeRole = async (req, res, next) => {
  const { field } = req.params
  try {
    const role = await findRoleWithIdOrTitle(field)

    const removeRoleResult = await RoleModel.deleteOne({ _id: role._id })

    if (!removeRoleResult.deletedCount) {
      throw createHttpError.InternalServerError(ResponseMessages.FAILED_DELETE_ROLE)
    }

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      success: true,
      message: ResponseMessages.DELETED_ROLE,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Find role with Id or title
 */
const findRoleWithIdOrTitle = async field => {
  const findQuery = mongoose.isValidObjectId(field) ? { _id: field } : { title: field }
  const role = await RoleModel.findOne(findQuery)
  if (!role) throw createHttpError.NotFound(ResponseMessages.DESIRED_ROLE_WAS_NOT_FOUND)
  return role
}
