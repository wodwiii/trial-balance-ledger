"use server"
import { connectToDatabase } from './db';
import { Journal } from '../models/Journal';
import { JournalDocument } from '../models/interface/Journal';
import { User } from '@/models/User';

export default async function CreateJournals(title: any, email:any) {
  try {
    const connection = await connectToDatabase();
    const JournalModel = connection.model<JournalDocument>('journal');
    const newJournalData = {
      title,
      owner: email,
      date_created: new Date(),
      tbl: '',
      entries: [],
    };
    const newJournal = await Journal.create(newJournalData);
    await User.updateOne(
        {email: email},
        {$push: {journals: newJournal._id}}
    );
    console.log('Journal created:', newJournal);
  } catch (error) {
    console.error('Error creating journal:', error);
  }
}
