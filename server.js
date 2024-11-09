require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const mongoose = require("mongoose"); 

const app = express();
const port = 3000; 

const corsOptions = {
    origin:"",
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue:false,
    optionSuccessStatus:204
}

app.use(cors(corsOptions));
app.use(bodyParser); 

//check server health
app.get("/health",(req,res)=>{
    res.send("Server is healty");
})

//default running log
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})