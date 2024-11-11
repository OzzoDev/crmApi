require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let users = [];

//send users array to client
app.get("/users", (req, res) => {
  res.json(users);
});

//apped to users array from client
app.post("/users", (req, res) => {
  const newUser = req.body.user;

  if (newUser) {

    const email = newUser.email;
    const confirmEmail = newUser.confirmEmail;
    const password = newUser.password;
    const confirmPassword = newUser.confirmPassword;

    let validCredentials = true; 
    let message = ""; 

    if(email!==confirmEmail){
        validCredentials = false;
    }else if(!email.includes(".")&&!email.includes("@")){
        validCredentials = false;
    }else if(password!==confirmPassword){
        validCredentials = false;
    }else if(password.length<8){
        validCredentials = false;
    }

    if(validCredentials){
        if(!users.includes(email)){
            users.push({email:email,password:password}); 
            message="User added successfully"; 
        }else{
            message="User alreday exists"
        }
    }else{
        message="Form is not valid": 
    }
    return res.status(201).json({ message: message, users });
  } else {
    return res.status(400).json({ message: "User is required" });
  }
});

//check server health
app.get("/health", (req, res) => {
  res.send("Server is healty");
});

//default running log
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
