import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); 

const MONGODB_URL = process.env.MONGODB_URL

export const connectDb = async () => {

    if (!MONGODB_URL) {
        console.log("Jagah ka pata to do bhai (MONGODB_URL)");
    }
    else{
        try {
            await mongoose.connect(MONGODB_URL!);
            
            console.log("✅ MongoDB Connected");
            
        } catch (error) {
            console.error("❌ MongoDB Connection Error:", error);
            process.exit(1); // Exit the process if DB connection fails
        }
    }
}


