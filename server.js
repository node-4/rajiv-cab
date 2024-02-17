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

// Assuming slab is dynamically defined
let slabs = [
  {
    _id: "65ccab921de44fc8c1b43f61",
    vehicle: "65cb20467a8ece998e959758",
    city: "65cb320ae51d4e909aeaf462",
    price: 10,
    toKm: 5,
    fromKm: 0,
    createdAt: "2024-02-14T12:01:22.367Z",
    updatedAt: "2024-02-14T12:01:22.367Z",
    __v: 0
  },
  {
    _id: "65ccaba31de44fc8c1b43f66",
    vehicle: "65cb20467a8ece998e959758",
    city: "65cb320ae51d4e909aeaf462",
    price: 8,
    toKm: 10,
    fromKm: 6,
    createdAt: "2024-02-14T12:01:39.385Z",
    updatedAt: "2024-02-14T12:01:39.385Z",
    __v: 0
  },
  {
    _id: "65ccaba31de44fc8c1b43f66",
    vehicle: "65cb20467a8ece998e959758",
    city: "65cb320ae51d4e909aeaf462",
    price: 5,
    toKm: 20,
    fromKm: 11,
    createdAt: "2024-02-14T12:01:39.385Z",
    updatedAt: "2024-02-14T12:01:39.385Z",
    __v: 0
  },
  {
    _id: "65ccaba31de44fc8c1b43f66",
    vehicle: "65cb20467a8ece998e959758",
    city: "65cb320ae51d4e909aeaf462",
    price: 4,
    toKm: 30,
    fromKm: 21,
    createdAt: "2024-02-14T12:01:39.385Z",
    updatedAt: "2024-02-14T12:01:39.385Z",
    __v: 0
  }
];
function calculatePricing(distance, slabs) {
  let totalPricing = 0;
  let lastToKm = 0;
  for (let i = 0; i < slabs.length; i++) {
    if (distance > slabs[i].toKm) {
      totalPricing += (slabs[i].toKm - lastToKm) * slabs[i].price;
      lastToKm = slabs[i].toKm;
    } else if (distance >= slabs[i].fromKm) {
      totalPricing += (distance - lastToKm) * slabs[i].price;
      break;
    }

  }

  return totalPricing;

}
// Test cases
// console.log("Distance: 5, Pricing:", calculatePricing(5, slabs)); // Output: 50
// console.log("Distance: 6, Pricing:", calculatePricing(6, slabs)); // Output: 58
// console.log("Distance: 7, Pricing:", calculatePricing(7, slabs)); // Output: 66
// console.log("Distance: 8, Pricing:", calculatePricing(8, slabs)); // Output: 74
// console.log("Distance: 9, Pricing:", calculatePricing(9, slabs)); // Output: 82
// console.log("Distance: 10, Pricing:", calculatePricing(10, slabs)); // Output: 90
// console.log("Distance: 11, Pricing:", calculatePricing(11, slabs)); // Output: 95
// console.log("Distance: 12, Pricing:", calculatePricing(12, slabs)); // Output: 100
// console.log("Distance: 13, Pricing:", calculatePricing(13, slabs)); // Output: 105
// console.log("Distance: 14, Pricing:", calculatePricing(14, slabs)); // Output: 110
// console.log("Distance: 15, Pricing:", calculatePricing(15, slabs)); // Output: 110
// console.log("Distance: 16, Pricing:", calculatePricing(16, slabs)); // Output: 110
// console.log("Distance: 17, Pricing:", calculatePricing(17, slabs)); // Output: 110
// console.log("Distance: 18, Pricing:", calculatePricing(18, slabs)); // Output: 110
// console.log("Distance: 19, Pricing:", calculatePricing(19, slabs)); // Output: 110
// console.log("Distance: 20, Pricing:", calculatePricing(20, slabs)); // Output: 110
// console.log("Distance: 21, Pricing:", calculatePricing(21, slabs)); // Output: 110
// console.log("Distance: 22, Pricing:", calculatePricing(22, slabs)); // Output: 110
// console.log("Distance: 23, Pricing:", calculatePricing(23, slabs)); // Output: 110

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});
module.exports = { handler: serverless(app) };
