const mongoose = require("mongoose");
const vehicleSchema = mongoose.Schema({
    name: {
        type: String,
        enum: ["Normal", "Configuration"]
    },
    image: {
        type: String
    },
    perKm: {
        type: Number,
    },
    basePrice: {
        type: Number,
    },
    taxRate: {
        type: Number,
    },
    gstRate: {
        type: Number,
    },
    serviceCharge: {
        type: Number,
    },
    nightCharges: {
        type: Number,
    },
    waitingCharge: {
        type: Number,
    },
    trafficCharge: {
        type: Number,
    },
})
const vehicle = mongoose.model('vehicleAmbulance', vehicleSchema);
module.exports = vehicle