const mongoose = require("mongoose");

const termsSchema = mongoose.Schema({
    terms: {
        type: String
    },
    privacy: {
        type: String
    },
    typeOf: {
        type: String,
        enum: ['privacy', 'terms']
    },
    type: {
        type: String,
        enum: ['vendor', 'user', 'driver']
    },
})
const terms = mongoose.model('terms', termsSchema);
module.exports = terms