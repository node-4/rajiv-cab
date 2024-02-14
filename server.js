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
let slab = [
  {
    _id: "65ccab921de44fc8c1b43f61",
    vehicle: "65cb20467a8ece998e959758",
    city: "65cb320ae51d4e909aeaf462",
    price: 10,
    toKm: 15,
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
    toKm: 50,
    fromKm: 16,
    createdAt: "2024-02-14T12:01:39.385Z",
    updatedAt: "2024-02-14T12:01:39.385Z",
    __v: 0
  }
];
// Function to calculate pricing for a given distance
// function calculatePricing(distance) {
//   let pricing = 0;

//   for (let i = 0; i < slab.length; i++) {
//     if (distance >= slab[i].fromKm && distance <= slab[i].toKm) {
//       pricing += slab[i].price * (distance - slab[i].fromKm);
//       break;
//     } else if (distance > slab[i].toKm) {
//       pricing += slab[i].price * (slab[i].toKm - slab[i].fromKm);
//     }
//   }

//   return pricing;
// }

// // Test cases
// console.log("Distance: 12, Pricing:", calculatePricing(12)); // Output: 120
// console.log("Distance: 15, Pricing:", calculatePricing(15)); // Output: 150
// console.log("Distance: 16, Pricing:", calculatePricing(16)); // Output: 158
// console.log("Distance: 17, Pricing:", calculatePricing(17)); // Output: 166
// console.log("Distance: 18, Pricing:", calculatePricing(18)); // Output: 174
// console.log("Distance: 19, Pricing:", calculatePricing(19)); // Output: 182
// console.log("Distance: 20, Pricing:", calculatePricing(20)); // Output: 190
// // your output below
// // Distance: 12, Pricing: 120
// // Distance: 15, Pricing: 150
// // Distance: 16, Pricing: 150
// // Distance: 17, Pricing: 158
// // Distance: 18, Pricing: 166
// // Distance: 19, Pricing: 174
// // Distance: 20, Pricing: 182

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});
module.exports = { handler: serverless(app) };
