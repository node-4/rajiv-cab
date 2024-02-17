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
  kmLimit: {
    type: Number,
  },
  kmPrice: {
    type: Number,
  },
  hrPrice: {
    type: Number,
  },
  hrLimit: {
    type: Number,
  },
  type: {
    type: String,
    enum: ["oneSide", "bothSide"]
  },
  isActive: {
    type: Boolean,
    default: true,
  },
},
  { timestamps: true }
);
const Pricing = mongoose.model("pricingOutStation", pricingSchema);
module.exports = Pricing;
