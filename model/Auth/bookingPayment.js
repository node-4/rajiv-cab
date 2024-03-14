const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { Schema } = mongoose;

const transactionStatus = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
  },
  id: {
    type: String
  },
  amount: {
    type: Number
  },
  adminAmount: {
    type: Number
  },
  driverAmount: {
    type: Number
  },
  paymentMode: {
    type: String,
    enum: ["CASH", "WALLET"],
  },
  transactionStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },

}, { timestamps: true })
transactionStatus.plugin(mongoosePaginate);
module.exports = mongoose.model("bookingPayment", transactionStatus);
