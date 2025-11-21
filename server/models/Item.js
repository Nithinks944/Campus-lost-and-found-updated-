import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Type is required'],
    },
    category: {
      type: String,
      enum: ['ID Card', 'Electronics', 'Books', 'Clothing', 'Other'],
      required: [true, 'Category is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    dateReported: {
      type: Date,
      default: Date.now,
    },
    dateLostOrFound: {
      type: Date,
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['open', 'matched', 'closed'],
      default: 'open',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ title: 'text', description: 'text', location: 'text' });

const Item = mongoose.model('Item', itemSchema);

export default Item;
