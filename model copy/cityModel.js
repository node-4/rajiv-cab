const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
    city: {
        type: String
    },
    countryCode: {
        type: String
    },
    stateCode: {
        type: String
    },
    latitude: {
        type: String
    },
    longitude: {
        type: String
    },
    limit: {
        type: Number,
        default: 50
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: "ACTIVE"
    }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("city", DocumentSchema);