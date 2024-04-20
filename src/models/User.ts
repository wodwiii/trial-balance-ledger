import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface UserDocument extends Document {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  journals: ObjectId[];
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  journals: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Journal',
    },
  ],
});

export const User = mongoose.model<UserDocument>('User', userSchema);
