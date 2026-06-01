import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  participants: string[];
  type: 'private' | 'group' | 'channel';
  name?: string;
  avatar?: string;
  lastMessage?: string;
  admin?: string;
  pinnedMessages: mongoose.Types.ObjectId[];
  pinnedBy: mongoose.Types.ObjectId[];
  archivedBy: mongoose.Types.ObjectId[];
  mutedBy: mongoose.Types.ObjectId[];
  wallpaper?: string;
  themeColor?: string;
  isPublic?: boolean;
  description?: string;
  pinnedMessageIds?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  type: { type: String, enum: ['private', 'group', 'channel'], default: 'private' },
  name: { type: String },
  avatar: { type: String },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  pinnedMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  pinnedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  archivedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  mutedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  wallpaper: { type: String },
  themeColor: { type: String },
  isPublic: { type: Boolean, default: false },
  description: { type: String },
  pinnedMessageIds: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, {
  timestamps: true
});

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
