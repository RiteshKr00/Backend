const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const HandleResponses = require("./app/middleware/HandleResponses");
const { emailmessage, sendMail } = require("./app/service/SendMail");

//Instead of manually specifying the headers, there is a CORS Express middleware package that can be used instead.
var corsOptions = {
  origin: "*", // restrict calls to those this address
};
// NEW - replace custom middleware with the cors() middleware
app.use(cors(corsOptions));
app.use(express.json()); //repalcement of bodyparser

app.post("/sendmail", (req, res) => {
  try {
    const { to, from, subject, html } = req.body.data;
    console.log(req.body);
    const message = emailmessage(to, from, subject, html);
    sendMail(message);
    res.status(200).send("Mail Sent");
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

app.listen(process.env.PORT3 || 8001, () => {
  console.log("Server is runnng at port", process.env.PORT3);
});
