const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genderCategory",
  },
  mobileNumber: {
    type: String,
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
    enum: ["user", "admin", "driver", "vendor"],
    default: "user",
  },
  isBlock: {
    type: Boolean,
    default: false,
  },
  wallet: {
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
// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
