const mongoose = require("mongoose");
const express = require("express");
const app = express()

mongoose.connect("mongodb://localhost:27017/instagram", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const port = 2004

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
    
})
