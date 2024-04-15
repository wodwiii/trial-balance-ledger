"use server"
import { connectToDatabase } from "./db";

export default async function CreateJournals(title:any){
    try {
        const {db} = await connectToDatabase();
        const journalsCollection = db.collection('journals');
        const newJournal = {
            title,
            owner: 'user_id',
            date_created: new Date(),
            tbl: '',
            entries: [],
          };
          await journalsCollection.insertOne(newJournal);
          console.log('Journal created:', newJournal);
    } catch (error) {
        console.error('Error creating journal:', error);
    }
}