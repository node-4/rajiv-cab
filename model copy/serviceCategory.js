const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    category: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    banner: {
        type: String
    },
    type: {
        type: String,
        enum: ['Basic', 'Hourly', "Monthly", "superCar", "other"]
    }
})
const category = mongoose.model('serviceCategory', categorySchema);
module.exports = category