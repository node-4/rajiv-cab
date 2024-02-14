const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello world")
})
require('./routes/vendorRoute')(app);
require('./routes/userRoute')(app);
require('./routes/adminRoute')(app);
require('./routes/driverRoute')(app);
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);
mongoose.connect('mongodb+srv://node4:node4@cluster0.m36gc8y.mongodb.net/rajivCab?retryWrites=true&w=majority').then((data) => {
  console.log(`Mongodb connected with server: ${data.connection.host} : Rajiv cab`);
});
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});
module.exports = { handler: serverless(app) };
