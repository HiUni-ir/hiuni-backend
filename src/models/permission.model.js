import mongoose from 'mongoose'

const PermissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    id: false,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
)

export default mongoose.model('permission', PermissionSchema)
