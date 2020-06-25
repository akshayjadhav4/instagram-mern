require("dotenv").config()
const mongoose = require("mongoose");
const express = require("express");
const app = express()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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

const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
    
})
