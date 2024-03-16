const mongoose = require('mongoose');
const userLocationSchema = new mongoose.Schema({
  bookingId: {
    type: String,
  },
  settleBookingId: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },
  pickUpTime: {
    type: String,
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
    }
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
  dropTime: {
    type: String,
  },
  km: {
    type: Number,
  },
  pricing: {
    type: Number,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  subscriptionExpiration: {
    type: Date,
  },
  otp: {
    type: String,
  },
  dailyStatus: [{
    date: {
      type: Date,
    },
    morningStatus: {
      type: String,
      enum: ["pending", "pick", "drop"],
      default: 'pending',
    },
    eveningStatus: {
      type: String,
      enum: ["pending", "pick", "drop"],
      default: 'pending',
    },
  }],
  isSubscription: {
    type: Boolean,
    default: false,
  },
  morningStatus: {
    type: String,
    enum: ["pending", "pick", "drop"],
    default: 'pending',
  },
  eveningStatus: {
    type: String,
    enum: ["pending", "pick", "drop"],
    default: 'pending',
  },
  status: {
    type: String,
    enum: ["pending", "Accept"],
    default: 'pending',
  },
  pickFirst: {
    type: Number,
  },
}, { timestamps: true });
userLocationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('settleBooking', userLocationSchema);
