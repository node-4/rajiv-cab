const mongoose = require('mongoose');
const userLocationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  subscriptionExpiration: {
    type: Date,
  },
  isSubscription: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "Accept"],
    default: 'pending',
  },
}, { timestamps: true });
userLocationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('settleBooking', userLocationSchema);
