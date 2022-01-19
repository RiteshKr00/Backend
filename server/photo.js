const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const path = require("path");

//Instead of manually specifying the headers, there is a CORS Express middleware package that can be used instead.
var corsOptions = {
  origin: "*", // restrict calls to those this address
};
// NEW - replace custom middleware with the cors() middleware
app.use(cors(corsOptions));

//const db = require("./app/models");
// require("./app/models/user");

app.use(express.json()); //repalcement of bodyparser

require("./app/routes/userImage.routes")(app);

app.listen(process.env.PORT2 || 8000, () => {
  console.log("Server is runnng at port", process.env.PORT2);
});
