const mongoose = require("mongoose");
const express = require("express");
const app = express()

const port = 2004

app.listen(port,()=>{
    console.log(`Server running at ${port}`);
    
})
