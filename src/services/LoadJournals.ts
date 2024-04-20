"use server"
import { Journal } from "@/models/Journal";
import { connectToDatabase } from "./db";

const LoadJournals = async (email:any) =>{
    const connection = await connectToDatabase();
    const Journals = await Journal.find({owner: email}).lean();
    return Journals;
}
export default LoadJournals;