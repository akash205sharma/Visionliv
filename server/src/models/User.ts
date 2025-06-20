import mongoose from "mongoose";

import { Schema, model, Document, Model, Types } from "mongoose";


export interface IUser extends Document {
  ishost: boolean
  username: string
  password: string
  email: string
  name?: string
  tokens?: { token: string }[]
  bookings: Types.ObjectId[];

}

const userSchema = new Schema<IUser>({
  ishost: { type: Boolean },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: String,
  tokens: [{ token: String }],
  bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }]
})

export const User: Model<IUser> = model<IUser>('User', userSchema);
