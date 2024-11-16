import mongoose from "mongoose";

// Define the Todo schema
const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'personal'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  notes: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create the Todo model
const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
