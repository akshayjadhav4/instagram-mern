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
  likes: {
    type: Number,
    default: 0,
  },
  author: {
    type: ObjectId,
    ref: "User",
  },
  comments: {
    type: Array,
    default: [],
  },
  photo: {
    required:true,
    data: Buffer,
    contentType: String,
  },
});
module.exports = mongoose.model("Post", postSchema);
