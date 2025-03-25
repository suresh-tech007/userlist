import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User  from "./model/user.js"

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend requests

// 🔹 MongoDB Connection
mongoose.connect("mongodb://localhost:27017/mydatabase")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// 🔹 Register API
app.post("/api/users/register", async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    // Check if user already exists
    let user = await User.findOne({ uid });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Save new user
    user = new User({ uid, email, displayName, photoURL });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    // console.log("Users found:", users);  

    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }

   return  res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});



// 🔹 Login API
app.post("/api/users/login", async (req, res) => {
  try {
    const { uid, email } = req.body;

    let user = await User.findOne({ uid });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({ uid, email, displayName: "", photoURL: "" });
      await user.save();
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


app.get("/users/user_details/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await User.findById(userId);
    console.log(userId , user)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({  user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// 🔹 Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
