import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  topic: string;
  userId: mongoose.Types.ObjectId;
  userDisplayName: string;
  userAvatar?: string;
  upvotes: number;
  downvotes: number;
  comments: string; // JSON string of comments array
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  topic: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userDisplayName: { type: String, required: true },
  userAvatar: { type: String },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  comments: { type: String, default: '[]' }, // JSON string of comments array
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Indexes
PostSchema.index({ topic: 1, createdAt: -1 });
PostSchema.index({ userId: 1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);