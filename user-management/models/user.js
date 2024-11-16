import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true }
  // Remove the 'userId' field, MongoDB will generate it as _id
});

// Create the user model
const User = mongoose.model("User", userSchema);

export default User;
