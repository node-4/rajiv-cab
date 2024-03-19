const mongoose = require('mongoose');
const schema = mongoose.Schema;
const DocumentSchema = schema({
        userId: { type: mongoose.Schema.ObjectId, ref: "User" },
        accountNumber: {
                type: String
        },
        id: {
                type: String,
        },
        ifsc: {
                type: String
        },
        upiId: {
                type: String
        },
        name: {
                type: String
        },
        mobileNumber: {
                type: String
        },
        message: {
                type: String
        },
        paymentReply: {
                type: String
        },
        screenShot: {
                type: String
        },
        amount: {
                type: Number,
                required: true
        },
        transactionType: {
                type: String,
                enum: ["REFUND", "PAYOUT"],
        },
        status: {
                type: String,
                enum: ["PAID", "PENDING", "FAILED"],
                default: "PENDING"
        },
        paymentMethod: {
                type: String,
                enum: ["GOOGLE_PAY", "BANK", "PAYTM"],
        },
}, { timestamps: true })
module.exports = mongoose.model("payoutTransaction", DocumentSchema);