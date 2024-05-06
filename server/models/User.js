// mengimport mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
// membuat model data yang akan dikirim ke database mongodb
const Schema = mongoose.Schema;
const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    // validasi agar yang di input user berisi email
    validate: {
      validator: function (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: "Please enter a valid email.",
    },
  },
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    message: "username is already in use.",
  },
  password: {
    type: String,
    trim: true,
    min: 6,
  },

  role: {
    type: String,
    default: "USER",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// userSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("User", userSchema);
