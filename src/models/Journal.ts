import mongoose, { Document } from 'mongoose';

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
export const Journal = mongoose.model('journal', journalSchema);