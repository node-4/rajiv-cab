const mongoose = require('mongoose');
const userLocationSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  settleBookingId: {
    type: String,
  },
  booking: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'settleBooking',
  }],
}, { timestamps: true });
userLocationSchema.index({ location: '2dsphere' });
module.exports = mongoose.model('driverSettleBooking', userLocationSchema);
