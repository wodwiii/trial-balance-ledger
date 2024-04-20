"use server"
import { connectToDatabase } from './db';
import { Journal, JournalDocument } from '../models/Journal';

export default async function CreateJournals(title: any) {
  try {
    const connection = await connectToDatabase();
    const JournalModel = connection.model<JournalDocument>('journal');
    const newJournalData = {
      title,
      owner: 'user_id',
      date_created: new Date(),
      tbl: '',
      entries: [],
    };
    const newJournal = await Journal.create(newJournalData);
    console.log('Journal created:', newJournal);
  } catch (error) {
    console.error('Error creating journal:', error);
  }
}
