const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
        walletMinimumAmount: {
                type: Number
        },
        walletMinimumAmountToAdd: {
                type: Number
        },
        walletMaximumAmountToAdd: {
                type: Number
        },
        driverWalletMinimumAmountToGetOrder: {
                type: Number
        },
        isActive: {
                type: Boolean,
                default: false
        }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("walletSetting", DocumentSchema);