import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { handle_response } from "../utils/centralized_response_handler.utils.js";
import { HttpStatusCodes } from "../constant.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET ;

// Register
export const registerUser = async (req, res, next) => {
  try {
    const { userName, number, email, password } = req.body;

    if (!userName || !number || !email || !password) {
      return handle_response(res, HttpStatusCodes.BAD_REQUEST, "All fields are required.");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { number }] });
    if (existingUser) {
      return handle_response(res, HttpStatusCodes.CONFLICT, "User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      number,
      email,
      password: hashedPassword,
    });

    await user.save();

    return handle_response(res, HttpStatusCodes.CREATED, "User registered successfully.");
  } catch (err) {
    next(err);
  }
};

// Login
export const loginUser = async (req, res, next) => {
  try {
    const { emailOrNumber, password } = req.body;

    if (!emailOrNumber || !password) {
      return handle_response(res, HttpStatusCodes.BAD_REQUEST, "All fields are required.");
    }

    const user = await User.findOne({
      $or: [{ email: emailOrNumber }, { number: emailOrNumber }],
    });

    if (!user) {
      return handle_response(res, HttpStatusCodes.UNAUTHORIZED, "Invalid credentials.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handle_response(res, HttpStatusCodes.UNAUTHORIZED, "Invalid credentials.");
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return handle_response(res, HttpStatusCodes.OK, "Login successful", {
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        number: user.number,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Logout (client-side should delete token)
export const logoutUser = (req, res) => {
  return handle_response(res, HttpStatusCodes.OK, "Logout successful. Clear token on client.");
};
