import User from "../models/user.js";
import crypto from "crypto";
import { generateToken } from "../utils/token.js";
import {
  emailVerification,
  passwordResetVerification,
} from "../utils/verification.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // Send verification email
  const verificationUrl = `http://localhost:8000/api/auth/verify/${verificationToken}`;
  await emailVerification(user, verificationUrl);

  res.status(201).json({
    success: true,
    message:
      "Registration successful! Please check your email to verify your account.",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

export const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token,
  });

  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid or expired verification token" });

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully! You can now log in.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return res.json({
      message:
        "If your email exists in our system, you will receive a password reset link.",
    });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Send password reset email
  const resetUrl = `http://localhost:8000/api/auth/reset-password/${token}`;
  await passwordResetVerification(user, resetUrl);

  res.json({
    message:
      "If your email exists in our system, you will receive a password reset link.",
  });
};

export const resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired reset token" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({
    message:
      "Password updated successfully! You can now log in with your new password.",
  });
};

export const profile = async (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({
    success: true,
    data: {
      user: { id: _id, name, email, role },
    },
  });
};
