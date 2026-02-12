import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
  phoneNumber?: string;
  username: string;
  starredMessages: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatar: { type: String, default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastSeen: { type: Date, default: Date.now },
  phoneNumber: { type: String },
  username: { type: String, unique: true, required: true },
  starredMessages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
