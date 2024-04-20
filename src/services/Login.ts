"use server"
import { User } from '@/models/User';
import { connectToDatabase } from '@/services/db';


export default async function Login(email:string, password:string) {
    try {
        const connection = await connectToDatabase();
        const UserModel = connection.model('User');
        const user = await User.findOne({ email });
        if (!user) {
          console.log(email);
          console.log('User not found');
          return;
        }
        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
          console.log('Invalid password');
          return;
        }
        console.log('Login successful');
        return user;
      } catch (error) {
        console.error('Login error:', error);
      }
}