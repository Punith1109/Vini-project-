import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // To enable cross-origin requests from React
import connectDB from "./config/db.js";
import User from "./models/user.js";
import Todo from "./models/todo.js";

const app = express();
const port = 5000;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors()); // Enable CORS for the React frontend

// Connect to MongoDB
connectDB();

// Register a new user
app.post("/api/users/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new todo
app.post("/api/todos", async (req, res) => {
  const { userId, task, category, priority, dueDate, notes } = req.body;

  if (!userId || !task) {
    return res.status(400).json({ message: "User ID and task are required." });
  }

  try {
    // Check if the userId exists in the User collection
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a new todo with all fields
    const newTodo = new Todo({
      userId: user._id,
      task,
      category,
      priority,
      dueDate,
      notes,
      completed: false
    });
    await newTodo.save();

    res.status(201).json({ 
      message: "Todo added successfully!",
      id: newTodo._id // Send back the generated ID
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get todos for a user
app.get("/api/todos/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server initialization
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
