const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const replaySchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  author: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Replay", replaySchema);
