const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  driverVehicleCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverVehicleCategory",
  },
  driverDocument: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DriverDetail",
  },
  isDriverDocument: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["vehicle", "superCar", "vehicleAmbulance"]
  },
  mobileNumber: {
    type: String,
  },
  refferalCode: {
    type: String,
    default: ""
  },
  altMobileNumber: {
    type: String,
  },
  otp: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  noOfVehicle: {
    type: String,
  },
  gender: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'reject', 'hold'],
    default: 'pending',
  },
  profilePicture: {
    type: String,
    default: "",
  },
  loginType: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["user", "admin", "driver", "vendor", "superAdmin"],
    default: "user",
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  adminCash: {
    type: Number,
    default: 0,
  },
  totalBooking: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  },
});
userSchema.index({ location: '2dsphere' });
const User = mongoose.model("User", userSchema);
module.exports = User;
