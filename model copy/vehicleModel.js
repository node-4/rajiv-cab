const mongoose = require("mongoose");
const vehicleSchema = mongoose.Schema({
    name: {
        type: String
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ["auto", "bike", "car"]
    },
})
const vehicle = mongoose.model('vehicle', vehicleSchema);
module.exports = vehicle