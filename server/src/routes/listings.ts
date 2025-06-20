import express, { Request, Response } from "express";
import { Listing } from "../models/Listing";
import { connectDb } from "../config/db";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    await connectDb();

    const listings = await Listing.find(); // You can use filters if needed

    res.status(200).json({
      message: "Listings fetched successfully",
      listings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    await connectDb();

    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      res.status(404).json({ message: "Listing not found" });
    }
    else {
      res.status(200).json({
        message: "Listing fetched successfully",
        listing,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch listing" });
  }
});


router.post("/insertOne", async (req: Request, res: Response) => {

  const data = req.body;
  console.log(req.body, data)
  try {
    await connectDb();
    const listing = await Listing.create(data);

    res.status(201).json({
      message: "Listing inserted successfully",
      listing,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to insert listing" });
  }
});

router.get("/host/:hostId", async (req: Request, res: Response) => {
  try {
    const listings = await Listing.find({ hostId: req.params.hostId });
    res.status(200).json({ listings });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch host listings" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { hostId } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) { res.status(404).json({ message: "Listing not found" }); return; }
    if (listing.hostId.toString() !== hostId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await listing.deleteOne();
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete listing" });
  }
});


export default router;
