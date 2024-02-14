const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: {
        type: String
    }
})
const category = mongoose.model('genderCategory', categorySchema);
module.exports = category