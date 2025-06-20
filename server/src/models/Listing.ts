import mongoose from "mongoose";

import { Schema, model, Document, Model, Types } from "mongoose";


const ListingSchema = new mongoose.Schema({
  image: String,
  location: String,
  price: Number,
  nights: Number,
  rating: Number,
  description: String,
  hostId: { type: Types.ObjectId, ref: "User", required: true },
  booking: {
    isbooked: { type: Boolean, required: true },
    userId: { type: Types.ObjectId, ref: "User"}
  }
});

export const Listing = mongoose.models.Listing || mongoose.model("Listing", ListingSchema);
