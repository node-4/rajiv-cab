const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
        phone: {
                type: String
        },
        phoneText: {
                type: String
        },
        policeNumber: {
                type: String
        },
        policeNumberText: {
                type: String
        },
        ambulanceNumber: {
                type: String
        },
        ambulanceNumberText: {
                type: String
        },
        isActive: {
                type: Boolean,
                default: false
        }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("emergencyDatails", DocumentSchema);