const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
  },
  totalSheet: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  settleBookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'settleBooking',
  }],
}, { timestamps: true, });
const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
