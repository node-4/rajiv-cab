const mongoose = require('mongoose');
const userLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  serviceCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceCategory",
  },
  superCar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "superCar",
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },
  genderCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "genderCategory",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    default: 'pending',
  },
  date: {
    type: String,
  },
  otpVerifiedAt: {
    type: String,
  },
  time: {
    type: String,
  },
  otp: {
    type: String,
  },
  drop: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  current: {
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: "",
    },
  },
  serviceType: {
    type: String,
    enum: ['general', 'bike', 'airport', 'outOfStation', 'delivery', 'auto', "ambulance"],
    default: 'general',
  },
  startDateTime: {
    type: String,
  },
  endDateTime: {
    type: String,
  },
  startHourlyTime: {
    type: Date,
  },
  endHourlyTime: {
    type: Date,
  },
  hour: {
    type: String,
  },
  totalHour: {
    type: String,
  },
  ambulance: {
    type: String,
    enum: ['normal', 'configuration'],
  },
  type: {
    type: String,
    enum: ['Basic', 'Hourly', 'superCar', 'other'],
    default: 'Basic',
  },
  distance: {
    type: String,
  },
  totalDistance: {
    type: String,
  },
  price: {
    type: String,
  },
  additional: {
    type: String,
  },
  totalPrice: {
    type: String,
  },
}, { timestamps: true });
userLocationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('booking', userLocationSchema);