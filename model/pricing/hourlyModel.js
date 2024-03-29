const mongoose = require("mongoose");
const pricingSchema = new mongoose.Schema({
        vehicle: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "vehicle",
        },
        city: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "city",
        },
        km: {
                type: Number,
        },
        price: {
                type: Number,
        },
        hours: {
                type: Number,
        },
        isActive: {
                type: Boolean,
                default: true,
        },
}, { timestamps: true });
const Pricing = mongoose.model("pricingHourly", pricingSchema);
module.exports = Pricing;
