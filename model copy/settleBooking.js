const mongoose = require('mongoose');
const userLocationSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  users: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    otpVerifiedAt: {
      type: String,
    },
    otp: {
      type: String,
    },
    subscriptionExpiration: {
      type: Date,
    },
    isSubscription: {
      type: Boolean,
      default: false,
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
    status: {
      type: String,
      default: 'pending',
    },
  }],
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pickUpTime: {
    type: String,
  },
  dropTime: {
    type: String,
  },
  totalSheet: {
    type: Number,
    required: true,
  },
  availableSheet: {
    type: Number,
    required: true,
  },
}, { timestamps: true });
userLocationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('settleBooking', userLocationSchema);