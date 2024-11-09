require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const mongoose = require("mongoose"); 

const app = express();
const port = 3000; 

const corsOptions = {
    origin:"*",
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue:false,
    optionSuccessStatus:204
}

app.use(cors(corsOptions));
app.use(bodyParser.json()); 

let users = [];

//send users array to client
app.get("/users",(req,res)=>{
    res.json(users);
})

//apped to users array from client
app.post("/users",(req,res)=>{
    const newUser = req.body.user;

    if(newUser){
        users.push(newUser);
        return res.status(201).json({message:"User added successfully",users}); 
    }else{
        return res.status(400).json({message:"User is required"})
    }

})


//check server health
app.get("/health",(req,res)=>{
    res.send("Server is healty");
})

//default running log
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})