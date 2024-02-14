const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: {
        type: String
    },
    discountPer: {
        type: Number,
        default: 0
    },
    isDiscount: {
        type: Boolean,
        default: false
    },
})
const category = mongoose.model('genderCategory', categorySchema);
module.exports = category