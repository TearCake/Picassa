import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { userName, displayName, email, password } = req.body;
  if (!userName || !displayName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const newHashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    userName,
    displayName,
    email,
    hashedPassword: newHashedPassword,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const { hashedPassword, ...userData } = user.toObject();
  res.status(201).json(userData);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const { hashedPassword, ...userData } = user.toObject();
  res.status(200).json(userData);
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const getUser = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { hashedPassword, ...userData } = user.toObject();
    const followerCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });

    const token = req.cookies.token;

    if (!token) {
      return res.status(200).json({
        ...userData,
        followerCount,
        followingCount,
        isFollowing: false,
      });
    } else {
      jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (!err) {
          const isExists = await Follow.exists({
            follower: payload.userId,
            following: user._id,
          });
          return res.status(200).json({
            ...userData,
            followerCount,
            followingCount,
            isFollowing: isExists ? true : false,
          });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const followUser = async (req, res) => {
  const { userName } = req.params;
  try {
    const user = await User.findOne({ userName });
    const isFollowing = await Follow.exists({
      follower: req.userId,
      following: user._id,
    });
    if (isFollowing) {
      await Follow.deleteOne({
        follower: req.userId,
        following: user._id,
      });
      return res.status(200).json({ message: `Unfollowed ${userName}` });
    } else {
      await Follow.create({
        follower: req.userId,
        following: user._id,
      });
      res.status(200).json({ message: `Followed ${userName}` });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
