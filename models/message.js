const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    content: String,
    user: String,
    chatSession:String 
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
