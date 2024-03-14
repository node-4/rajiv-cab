const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
        googleMapKeyForWebApp: {
                type: String
        },
        googleMapKeyForDistanceMatrix: {
                type: String
        },
        googleSheetId: {
                type: String
        },
        isActive: {
                type: Boolean,
                default: false
        }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("mapSetting", DocumentSchema);