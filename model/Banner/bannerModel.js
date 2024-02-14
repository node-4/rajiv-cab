const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name Banner Required"],
    },
    image: {
        type: String
    },
    type: {
        type: String,
        enum: ['Top', 'bottom', 'middle'],
    },
});

module.exports = mongoose.model("Banner", bannerSchema);