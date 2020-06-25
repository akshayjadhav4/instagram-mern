const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");
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
  encry_password: {
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

//virtuals
userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

//schema methods
userSchema.methods = {

    authenticate:function(plainPassword){
        return this.securePassword(plainPassword) === this.password
    },

  securePassword: function (plainPassword) {
    if (!plainPassword) {
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
