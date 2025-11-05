import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  authProvider: {
    provider: 'clerk' | 'credentials' | 'github';
    providerUserId: string;
  };
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    bio?: string;
    tags?: string[];
  };
}

const UserSchema: Schema = new Schema({
  authProvider: {
    provider: {
      type: String,
      enum: ['clerk', 'credentials', 'github'],
      required: true,
    },
    providerUserId: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  profile: {
    bio: {
      type: String,
    },
    tags: [{
      type: String,
    }],
  },
});

// Indexes
UserSchema.index({ 'authProvider.provider': 1, 'authProvider.providerUserId': 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);