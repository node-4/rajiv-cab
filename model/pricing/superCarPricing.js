const mongoose = require("mongoose");
const pricingSchema = new mongoose.Schema({
  superCar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "superCar",
  },
  name: {
    type: String
  },
  image: [{
    img: {
      type: String
    }
  }],
  price: {
    type: Number,
  },
  // kmLimit
  // hrPrice
  // kmPrice
  // hrLimit
}, { timestamps: true });
const Pricing = mongoose.model("pricingSuperCar", pricingSchema);
module.exports = Pricing;
