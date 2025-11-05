import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  role: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);