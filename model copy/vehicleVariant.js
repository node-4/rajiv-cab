const mongoose = require("mongoose");

const variantSchema = mongoose.Schema({
    name: {
        type: String
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle',
        required: true,
    },
})
const variant = mongoose.model('vehicleVariant', variantSchema);
module.exports = variant