const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    maxlength: 32,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  followers: {
    type: Array,
    default:[]
  },
  following: {
    type: Array,
    default:[]
  },
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  // TODO: password
  password: {
    type: String,
    trim: true,
  },
  salt: String,
  role: {
    type: Number,
    default: 0,
  },
  userPosts: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User",userSchema)