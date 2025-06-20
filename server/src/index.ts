import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings'
import bookingRoutes from './routes/booking'
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 4000
const ORIGIN = process.env.ORIGIN

app.use(
    cors({
        origin: `${ORIGIN}`,
        credentials: true,
    })
);


app.use(express.json());
app.use(cookieParser())

app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", async (req, res) => {
    res.send("hello");
})


app.listen(port, () => console.log("kya hukum hai mere aka",port));

