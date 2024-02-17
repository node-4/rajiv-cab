const mongoose = require("mongoose");
const vehicleSchema = mongoose.Schema({
        superCar: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "pricingSuperCar",
        },
        vehicle: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "vehicle",
        },
        vehicleAmbulance: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "vehicleAmbulance",
        },
        name: {
                type: String
        },
        type: {
                type: String,
                enum: ["vehicle", "superCar", "vehicleAmbulance"]
        },
}, { timestamps: true })
const vehicle = mongoose.model('driverVehicleCategory', vehicleSchema);
module.exports = vehicle