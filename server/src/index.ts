import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings'
import bookingRoutes from './routes/booking'
import cookieParser from "cookie-parser";
import stripeRoutes from './routes/stripe';
import dotenv from "dotenv";

import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();


const app = express();
const port = process.env.PORT || 4000
const ORIGIN = process.env.ORIGIN

app.use(
  cors({
    origin: `${ORIGIN}`, // ✅ specific origin
    credentials: true, // ✅ allow cookies/headers
  })
);



app.use(express.json());
app.use(cookieParser())

app.use("/auth", authRoutes);
app.use("/listings", listingRoutes);
app.use("/bookings", bookingRoutes);
app.use('/stripe', stripeRoutes);

app.get("/", async (req, res) => {
  res.send("hello");
})
app.get('/ping', (req, res) => {
  res.send('pong 🏓')
})

app.listen(port, () => console.log("server running", port));

