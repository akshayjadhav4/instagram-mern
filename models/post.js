const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const postSchema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  location: {
    type: String,
    trim: true,
    maxlength: 25,
  },
  likes: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  author: {
    type: ObjectId,
    ref: "User",
    required : true
  },
  comments: {
    type: Array,
    default: [],
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
},{ timestamps: true });
module.exports = mongoose.model("Post", postSchema);
