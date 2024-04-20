import mongoose, { Document } from 'mongoose';

export interface JournalDocument extends Document {
  title: string;
  owner: string;
  date_created: Date;
  tbl: string;
  entries: any[];
}

const journalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  tbl: String,
  entries: [Object],
});
export const Journal = mongoose.model<JournalDocument>('journal', journalSchema);