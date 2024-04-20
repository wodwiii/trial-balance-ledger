import { Document } from 'mongoose';

export interface JournalDocument extends Document {
  title: string;
  owner: string;
  date_created: Date;
  tbl: string;
  entries: any[];
}