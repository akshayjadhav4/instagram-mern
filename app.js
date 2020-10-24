require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const client = require("socket.io").listen(server).sockets; //running socket.io
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authentication");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const Message = require("./models/message");

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");

    //connect to socket.io
    client.on("connection", function (socket) {
      // Get the last messages from the database.

      socket.on("join", (chatSession) => {
        Message.find(
          // { chatSession: chatSession }
          {
            $or: [
              { chatSession: chatSession.chatSession1 },
              { chatSession: chatSession.chatSession2 },
            ],
          }
        )
          .sort({ createdAt: -1 })
          .limit(20)
          .exec((err, messages) => {
            if (err) return console.error(err);

            // Send the last messages to the user.
            socket.emit("output", messages);
          });
      });

      // realtime sync
      const db = mongoose.connection;
      const messageCollection = db.collection("messages");
      const changeStream = messageCollection.watch();
      changeStream.on("change", (change) => {
        console.log(change);
        if (change.operationType === "insert") {
          const messageDetails = change.fullDocument;
          socket.emit("insert", messageDetails);
        }
      });

      //Listen to connected users for a new message.
      socket.on("message", function (messageInput) {
        // Create a message with the content and the name of the user.
        const message = new Message({
          content: messageInput.content,
          user: messageInput.user,
          chatSession: messageInput.chatSession,
        });

        if (messageInput.content == "" || messageInput.user == "") {
          socket.emit("status", "Please provide content and user");
        } else {
          // Save the message to the database.
          message.save((err, msg) => {
            if (err) return console.error(err);
          });
        }
      });

      //handle clear
      socket.on("clear", function (data) {
        //remove all chats from database
        Message.remove({}, function () {
          socket.emit("cleared");
        });
      });
    });
  });

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", commentRoutes);

const port = process.env.PORT;

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
