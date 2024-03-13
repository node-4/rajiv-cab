const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
    serviceTax: {
        type: Number
    },
    disCountType: {
        type: String,
        enum: ["PERCENTAGE", "FLAT"]
    },
    adminCommission: {
        type: Number
    },
    driverCommission: {
        type: Number
    },
    driverSearchRadius: {
        type: Number
    },
    userCanScheduleBookAfterMin: {
        type: Number
    },
    minimumTimeDriverFindInMinutes: {
        type: Number
    },
    maximumTimeFindInMinutesDriverForRegularRide: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("commission", DocumentSchema);