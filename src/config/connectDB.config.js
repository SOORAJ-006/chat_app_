import mongoose from "mongoose";

export default async function connectDB()  {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING)
    console.log('DB Connected : ' , connect.connection.name);
    
  } catch (error) {
    console.error(error);
    process.exit(1)
  }
}