import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    parent: { type: mongoose.Types.ObjectId, default: undefined, ref: 'category' },
  },
  {
    id: false,
    versionKey: false,
    toJSON: {
      virtuals: true,
    },
  }
)

CategorySchema.virtual('subcategories', {
  ref: 'category',
  localField: '_id',
  foreignField: 'parent',
})

function autoPopulate(next) {
  this.populate([{ path: 'subcategories' }])
  next()
}

CategorySchema.pre('findOne', autoPopulate).pre('find', autoPopulate)

export default mongoose.model('category', CategorySchema)
