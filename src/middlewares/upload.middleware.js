import fs from 'fs'
import path from 'path'

import multer from 'multer'
import createHttpError from 'http-errors'

import { nanoid, alphabetLowerCaseLetters } from '../utils/nanoid.util.js'

const pictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = './uploads/profiles'
    fs.mkdirSync(directory, { recursive: true })
    return cb(null, directory)
  },
  filename: (req, file, cb) => {
    cb(null, nanoid(alphabetLowerCaseLetters, 16) + path.extname(file.originalname))
  },
})

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const directory = './uploads/files'
    fs.mkdirSync(directory, { recursive: true })
    return cb(null, directory)
  },
  filename: (req, file, cb) => {
    cb(null, nanoid(alphabetLowerCaseLetters, 16) + path.extname(file.originalname))
  },
})

const pictureFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  const mimetypes = ['.jpg', '.jpeg', '.png', '.gif']
  if (mimetypes.includes(ext)) return cb(null, true)
  return cb(createHttpError.BadRequest('The submitted image format is not correct'))
}

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  const mimetypes = ['.docx', '.pdf']
  if (mimetypes.includes(ext)) return cb(null, true)
  return cb(createHttpError.BadRequest('File format must be .docx or .pdf'))
}

const fileMaxSize = 5 * 1000 * 1000 // 5MB
const pictureMaxSize = 2 * 1000 * 1000 // 2MB

export const uploadFile = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fileSize: fileMaxSize },
})

export const uploadPicture = multer({
  storage: pictureStorage,
  pictureFilter,
  limits: { fileSize: pictureMaxSize },
})
