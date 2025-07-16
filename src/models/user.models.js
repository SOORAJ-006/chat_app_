import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, trim: true },
    number: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: null },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
