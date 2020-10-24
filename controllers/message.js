const Message = require("../models/message");
const mongoose = require("mongoose");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const db = mongoose.connection;
db.once("open", () => {
  // mongodb change stream
  const messageCollection = db.collection("messages");
  const changeStream = messageCollection.watch();

  changeStream.on("change", (change) => {
    // actual pusher working
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger(messageDetails.chatSession, "newMessage", messageDetails);
    } else {
      console.log("PUSHER ERROR");
    }
  });
});

exports.newMessage = (req, res) => {
  const message = req.body;

  Message.create(message, (error, message) => {
    if (error) {
      res.status(500).json({
        error: "Error while sending message",
      });
    } else {
      res.status(201).send(message);
    }
  });
};

exports.syncMessages = (req, res) => {
  const chatSession1 = req.params.sendId + req.params.receiveId;
  const chatSession2 = req.params.receiveId + req.params.sendId;

  Message.find({
    $or: [{ chatSession: chatSession1 }, { chatSession: chatSession2 }],
  })
    .sort({ createdAt: 1 })
    .limit(20)
    .exec((error, messages) => {
      if (error) {
        res.status(500).json({
          error: "Error while getting messages",
        });
      } else {
        res.status(200).send(messages);
      }
    });
};
