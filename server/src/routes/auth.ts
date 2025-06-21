import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";
import { signupInput } from "../middleware/validate";
import { User } from "../models/User";
import { connectDb } from "../config/db";
import { Types } from "mongoose";
import bcrypt from 'bcrypt';

const SECRET = process.env.JWT_SECRET!;
const router = express.Router();

router.post("/signup", async (req, res) => {

	let parsedInput = signupInput.safeParse(req.body)
	if (!parsedInput.success) {
		res.status(403).json({
			message: "zod is not allowing"
		});
		return;
	}
	const user = parsedInput.data
	try {

		await connectDb()

		const prevUser = await User.findOne({
			$or: [
				{ 'username': user?.username },
				{ 'email': user?.email }
			]
		})

		if (prevUser) {
			res.status(403).json({ message: "user exist Already " });
			return;
		}


		const hashedPassword = await bcrypt.hash(user.password, 10);

		const newUser = new User({
			...user,
			password: hashedPassword,
		});

		await newUser.save();

		const token = jwt.sign({ id: newUser._id }, SECRET!, { expiresIn: '1h' });

		res.cookie("token", token, {
			httpOnly: true,        // 🔒 Prevents JavaScript access (XSS protection)
			secure: true,          // 🔒 Only send over HTTPS (Set to false in dev)
			sameSite: "strict",    //  Prevent CSRF attacks
		});

		const userData: { status: string; _id: string; email: string; name: string; username: string; bookings: Types.ObjectId[], ishost: boolean } = {
			status: "logged",
			_id: newUser.id,
			email: newUser.email,
			name: newUser.name!,
			username: newUser.username,
			bookings: newUser.bookings,
			ishost: newUser.ishost
		};
		res.status(200).json({ message: "User created successfully", userData });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Could not create account" });
	}
})


router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.status(400).json({ message: "Username and password required" });
		return;
	}
	try {
		await connectDb()

		const prevUser = await User.findOne({ username });

		if (!prevUser) res.status(403).json({ message: "User does not exist " });

		else {

			const isMatch = await bcrypt.compare(password, prevUser.password);
			if (!isMatch) {
				res.status(401).json({ message: "Invalid credentials" });
				return;
			}

			const token = jwt.sign({ id: prevUser._id }, SECRET!, { expiresIn: '1h' });

			res.cookie("token", token, {
				httpOnly: true,        // 🔒 Prevents JavaScript access (XSS protection)
				secure: true,          // 🔒 Only send over HTTPS (Set to false in dev)
				sameSite: "strict",    // 🛑 Prevent CSRF attacks
			});

			const userData: { status: string; _id: string; email: string; name: string; username: string; bookings: Types.ObjectId[]; ishost: boolean } = {
				status: "logged",
				_id: prevUser.id,
				email: prevUser.email,
				name: prevUser.name!,
				username: prevUser.username,
				bookings: prevUser.bookings,
				ishost: prevUser.ishost
			};

			res.json({ message: "User Logged in successfully", userData });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Could not login" });
	}
})

router.get("/users/:id", async (req, res) => {
	try {
		await connectDb();
		const user = await User.findById(req.params.id).populate('bookings');
		if (!user) res.status(404).json({ message: "User not found" });
		else res.json({ user });
	} catch (error) {
		res.status(500).json({ message: "Error fetching user" });
	}
});

router.patch("/users/:id/host", async (req: Request, res: Response) => {
	try {
		await connectDb();

		const { id } = req.params;

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{ ishost: true },
			{ new: true }
		);

		if (!updatedUser) {
			res.status(404).json({ message: "User not found" });
			return
		}

		res.status(200).json({ message: "User is now a host", user: updatedUser });
	} catch (error) {
		console.error("Error updating host status:", error);
		res.status(500).json({ message: "Failed to update host status" });
	}
});



export default router;

