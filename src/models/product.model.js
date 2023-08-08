import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    source: { type: String, required: true },
    lessonCode: { type: String },
    authors: { type: [String], default: [] },
    publisher: { type: String },
    publishYear: { type: String },
    category: { type: mongoose.Types.ObjectId, required: true, ref: 'category' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export default mongoose.model('product', ProductSchema)
