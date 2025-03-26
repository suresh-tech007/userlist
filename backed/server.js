import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url"; // ✅ Fix for __dirname
import User from "./model/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // ✅ Define __dirname

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEDURL, credentials: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Ensure `uploads/` folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static images
app.use("/uploads", express.static(uploadDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ Now works with ES module
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Upload API
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File not uploaded" });
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ✅ User Routes

// 🔹 Create (Register User)
app.post("/api/users/register", async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    let user = await User.findOne({ uid });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ uid, email, displayName, photoURL });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 🔹 Read (Get All Users)
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// 🔹 Read (Get Single User)
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 🔹 Update User
app.put("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 🔹 Delete User
app.delete("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 🔹 Login API
app.post("/api/users/login", async (req, res) => {
  try {
    const { uid, email, photoURL, displayName } = req.body;
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, email, displayName, photoURL });
      await user.save();
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 🔹 Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
