const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  image: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String
  },
  body: {
    type: String
  },
  date: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  sendBy: {
    type: String,
    enum: ["ADMIN"],
  },
  sendTo: {
    type: String,
    enum: ["ADMIN", "USER", "VENDOR", "DRIVER"],
  },
  status: {
    type: String,
    enum: ["ACTIVE", "BLOCKED", "DELETE"],
    default: "ACTIVE"
  },
}, { timestamps: true });
module.exports = mongoose.model("Notification", notificationSchema);