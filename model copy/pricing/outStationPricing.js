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
},
  { timestamps: true }
);
const Pricing = mongoose.model("outStationPricing", pricingSchema);
module.exports = Pricing;
