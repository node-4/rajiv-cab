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
}, { timestamps: true });
const Pricing = mongoose.model("hourlyModel", pricingSchema);
module.exports = Pricing;
