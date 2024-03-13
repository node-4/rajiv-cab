const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate');
const { Schema } = mongoose;
const transactionStatus = new Schema({
        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
        },
        id: {
                type: String
        },
        locationInWord: {
                type: String
        },
        reason: {
                type: String
        },
        location: {
                type: {
                        type: String,
                        enum: ['Point'],
                        default: 'Point',
                },
                coordinates: {
                        type: [Number],
                        default: [0, 0]
                },
        },
        status: {
                type: String,
                enum: ["PENDING", "APPROVED", "REJECT"],
                default: "PENDING"
        },
}, { timestamps: true })
transactionStatus.plugin(mongoosePaginate);
module.exports = mongoose.model("sosRequest", transactionStatus);
