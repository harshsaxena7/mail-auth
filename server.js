const express =require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/connectDB");
const app =express();

const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cors())

app.use('/api',authRoutes);

app.listen(6900,function(){
    console.log("server is running");
});