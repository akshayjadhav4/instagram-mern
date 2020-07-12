require("dotenv").config()
const mongoose = require("mongoose");
const express = require("express");
const app = express()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/authentication")
const userRoutes = require("./routes/user")
const postRoutes = require("./routes/post")
const commentRoutes = require("./routes/comment")

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(()=>{
    console.log("DB CONNECTED");
    
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Routes
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",postRoutes)
app.use("/api",commentRoutes)

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
    
})
