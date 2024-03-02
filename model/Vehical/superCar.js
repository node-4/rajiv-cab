const mongoose = require("mongoose");
const pricingSchema = new mongoose.Schema({
  name: {
    type: String
  },
  image: {
    type: String
  },
  superCarPricing: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "pricingSuperCar",
  }],
}, { timestamps: true });
const Pricing = mongoose.model("superCar", pricingSchema);
module.exports = Pricing;