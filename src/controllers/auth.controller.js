import User from "../models/User.js";
import crypto from "crypto";
import { generateToken } from "../utils/token.js";

/* REGISTER !! */
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

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    verificationToken,
  });
};

/* LOGIN !! */
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);

res.json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
});

};

/* VERIFY EMAIL !! */
export const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    verificationToken: req.params.token,
  });

  if (!user) return res.status(400).json({ message: "Invalid token" });

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.json({ message: "Email verified" });
};

/* FORGOT PASSWORD !! */
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.json({ message: "If email exists, reset sent" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  res.json({ resetToken: token });
};

/* RESET PASSWORD !! */
export const resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: "Token expired" });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password updated" });
};

/* PROFILE (protected) */
export const profile = async (req, res) => {
  res.json(req.user);
};
