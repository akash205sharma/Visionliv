import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  bookingDate: { type: Date, required: true },
  checkIn : { type: Date, required: true },
  checkOut:{ type: Date, required: true },
  totalAmount: {type: Number, required:true}
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);


