import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver?: mongoose.Types.ObjectId;
  chatId: mongoose.Types.ObjectId;
  text?: string;
  type: 'text' | 'image' | 'file' | 'voice';
  mediaUrl?: string;
  replyTo?: mongoose.Types.ObjectId;
  isForwarded?: boolean;
  status: 'sent' | 'delivered' | 'read';
  timestamp: Date;
  reactions: Array<{
    userId: mongoose.Types.ObjectId;
    emoji: string;
  }>;
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  text: { type: String },
  type: { type: String, enum: ['text', 'image', 'file', 'voice'], default: 'text' },
  mediaUrl: { type: String },
  replyTo: { type: Schema.Types.ObjectId, ref: 'Message' },
  isForwarded: { type: Boolean, default: false },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
  timestamp: { type: Date, default: Date.now },
  reactions: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    emoji: { type: String }
  }]
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
