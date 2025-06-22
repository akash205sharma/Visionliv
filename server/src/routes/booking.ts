import express, { Request, Response } from "express";
import { connectDb } from "../config/db";
import { User } from "../models/User";
import Booking from "../models/Booking";
import { Listing } from "../models/Listing";

const router = express.Router();

//"book"
router.post("/", async (req: Request, res: Response) => {
  try {
    await connectDb();

    const { userId, listingId, bookingDate, checkIn, checkOut, totalAmount } = req.body;

    if (!userId || !listingId || !bookingDate) {
      res.status(400).json({ message: "Missing required fields" });
      return
    }

    // 🔒 Check if booking already exists for this user and listing
    const existingBooking = await Booking.findOne({ userId, listingId });

    if (existingBooking) {
      res.status(409).json({ message: "Booking already exists for this listing and user." });
      return;
    }

    // ✅ Create booking
    const newBooking = new Booking({
      userId,
      listingId,
      bookingDate,
      checkIn,
      checkOut,
      totalAmount
    });

    await newBooking.save();

    // ✅ Add booking ID to user (no duplicate IDs in array)
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { bookings: newBooking._id } },
      { new: true }
    );

    await Listing.findByIdAndUpdate(
      listingId,
      {
        $set: {
          booking: {
            isbooked: true,
            userId: userId,
          },
        },
      },
      { new: true }
    );


    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking" });
  }
});

//check is booked 
router.post("/check", async (req: Request, res: Response) => {
  try {
    const { userId, listingId } = req.body;
    if (!userId || !listingId) {
      res.status(400).json({ isBooked: false });
      return;
    }

    const existingBooking = await Booking.findOne({ userId, listingId });
    res.status(200).json({ isBooked: existingBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ isBooked: false });
  }
});

router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    await connectDb();

    const bookings = await Booking.find({ userId: req.params.id })
      .populate("listingId");

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

router.delete("/:bookingId", async (req: Request, res: Response) => {
  try {
    await connectDb();

    const { bookingId } = req.params;
    const { userId, listingId } = req.query;

    await Booking.findByIdAndDelete(bookingId);

    await User.findByIdAndUpdate(userId, {
      $pull: { bookings: bookingId },
    });

    await Listing.findByIdAndUpdate(listingId, {
      $set: {
        booking: {
          isbooked: false,
          userId: null,
        },
      },
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("❌ Error cancelling booking:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});


export default router;

