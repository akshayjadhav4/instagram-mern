const mongoose = require("mongoose");
const crypto = require("crypto");
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
    default: [],
  },
  following: {
    type: Array,
    default: [],
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
    required: true,
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

//schema methods
userSchema.method = {
  securePassword: function (plainPassword) {
    if (!password) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
