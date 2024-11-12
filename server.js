require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

const email = process.env.EMAIL;
const emailPassword = process.env.EMAIL_PASSWORD;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: emailPassword,
  },
});

let users = [];
let passChangeCodes = [];

//send users array to client
app.get("/users", (req, res) => {
  res.json(users);
});

//append to users array from client
app.post("/users", (req, res) => {
  const newUser = req.body.user;

  if (newUser) {
    const email = newUser.email;
    const password = newUser.password;
    const confirmPassword = newUser.confirmPassword;

    let validCredentials = true;
    let message = "";

    if (!email.includes(".") && !email.includes("@")) {
      validCredentials = false;
    } else if (password !== confirmPassword) {
      validCredentials = false;
    } else if (password.length < 8) {
      validCredentials = false;
    }

    if (validCredentials) {
      if (users.filter((user) => user.email === email).length === 0) {
        users.push({ email: email, password: password });
        message = "User added successfully";
      } else {
        message = "User alreday exists";
      }
    } else {
      message = "Form is not valid";
    }
    return res.status(201).json({ message: message, users });
  } else {
    return res.status(400).json({ message: "User is required" });
  }
});

app.post("/passCode", (req, res) => {
  const clientEmail = req.body.email;

  let code = "";
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }

  passChangeCodes.push({ email: clientEmail, code: code });

  const mailOptions = {
    from: email,
    to: clientEmail,
    subject: "Reset password",
    text: code,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error", error.toString());
      return res.status(500).send(error.toString());
    }
    res.status(200).json({ code: code, message: "Email sent: " + info.response });
  });
});

app.post("/changePassword", (req, res) => {
  const clientEmail = req.body.credentials.email;
  const clientPassword = req.body.credentials.password;
  const clientConfirmPassword = req.body.credentials.confirmNewPassWord;
  const passChangeCode = req.body.credentials.code;

  const user = users.find((user) => user.email === clientEmail);
  const passCodeRecord = passChangeCodes.find((record) => record.email === clientEmail);

  if (clientPassword === clientConfirmPassword && passCodeRecord && passCodeRecord.code === passChangeCode) {
    user.password = clientConfirmPassword;
    return res.status(201).json({ message: "Password changed", users: users });
  }

  return res.status(400).json({ message: "Error changing password" });
});

//check server health
app.get("/health", (req, res) => {
  res.send("Server is healty");
});

//default running log
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
