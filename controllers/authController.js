
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function signup(req, res, next) {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address."
      });
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit mobile number."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters."
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    const existingEmail = await User.findOne({ email: cleanEmail });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered."
      });
    }

    const existingPhone = await User.findOne({ phone: cleanPhone });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Phone number already registered."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already registered."
      });
    }

    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail })
      .select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token
    });

  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.userId)
      .select("fullName email phone createdAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: user
    });

  } catch (error) {
    next(error);
  }
}
