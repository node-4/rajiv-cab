const mongoose = require("mongoose");

const cancelSchema = mongoose.Schema({
    cancel: {
        type: String
    }
})
const cancel = mongoose.model('cancel', cancelSchema);

module.exports = cancel