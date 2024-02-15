const mongoose = require("mongoose");
const pricingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },
  price: {
    type: Number,
  },
  // time
  // km
  // isActive: true/false
},
  { timestamps: true }
);
const Pricing = mongoose.model("pricingOutStation", pricingSchema);
module.exports = Pricing;
