import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  type: 'image' | 'video';
  isRead: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const StorySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
    index: { expires: '24h' } // TTL index for automatic deletion
  },
});

export default mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);
