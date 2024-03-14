const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
        referralForUser: {
                type: Number
        },
        referralForDriver: {
                type: Number
        },
        isActive: {
                type: Boolean,
                default: false
        }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("referralSetting", DocumentSchema);