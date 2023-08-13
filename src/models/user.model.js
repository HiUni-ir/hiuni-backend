import mongoose from 'mongoose'
import { nanoid, alphabetNumber, alphabetLowerCaseLetters } from '../utils/nanoid.util.js'

const UserSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    username: {
      type: String,
      lowercase: true,
      default: nanoid(alphabetNumber + alphabetLowerCaseLetters, 10),
      unique: true,
    },
    mobile: { type: String, required: true, unique: true },
    verifiedMobile: { type: Boolean, default: false },
    otp: {
      type: Object,
      default: {
        code: 0,
        expiresIn: 0,
      },
    },
    role: {
      type: String,
      required: true,
      default: 'student',
      enum: ['student', 'writer', 'admin'],
    },
    avatar: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

UserSchema.virtual('full_name').get(function () {
  return `${this.first_name} ${this.last_name}`
})

UserSchema.index({
  first_name: 'text',
  last_name: 'text',
  username: 'text',
  mobile: 'text',
  first_name: 'text',
})

export default mongoose.model('user', UserSchema)
