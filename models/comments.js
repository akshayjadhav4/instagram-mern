const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const commentsSchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  reply: {
    type: Array,
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  post: {
    type: ObjectId,
    ref: "Post",
  },
});


module.exports = mongoose.model("Comment", commentsSchema);