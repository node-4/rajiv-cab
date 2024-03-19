const mongoose = require('mongoose');
const userLocationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
  },
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
    ref: "pricingSuperCar",
  },
  vehicleAmbulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicleAmbulance",
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
  paymentMode: {
    type: String,
    enum: ['cash', 'upi', "pending"],
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
    enum: ['daily', 'bike', 'Hourly', 'airport', 'superCar', 'outOfStation', 'delivery', 'auto', "ambulance"],
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
  outOfStationType: {
    type: String,
    enum: ["oneSide", "bothSide"]
  },
  type: {
    type: String,
    enum: ['Basic', 'Hourly', 'superCar'],
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
  adminAmount: {
    type: Number,
    default: 0
  },
  driverAmount: {
    type: Number,
    default: 0
  },
  isCommission: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
userLocationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('booking', userLocationSchema);