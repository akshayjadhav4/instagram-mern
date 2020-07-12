const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const commentsSchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  likes: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  post: {
    type: ObjectId,
    ref: "Post",
  },
  postedBy :{
    type: String
  }
},{ timestamps: true });


module.exports = mongoose.model("Comment", commentsSchema);