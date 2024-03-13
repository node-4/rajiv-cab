const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
        logo: {
                type: String
        },
        favicon: {
                type: String
        },
        appName: {
                type: String
        },
        currencyName: {
                type: String
        },
        countryCode: {
                type: String
        },
        latitude: {
                type: Number,
                default: 0.0
        },
        longitude: {
                type: Number,
                default: 0.0
        },
        isActive: {
                type: Boolean,
                default: false
        }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("appSetting", DocumentSchema);