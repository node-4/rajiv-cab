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
        description: {
                type: String,
        },
},
        { timestamps: true });
const Pricing = mongoose.model("basePricing", pricingSchema);
module.exports = Pricing;