const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
    adminCommission: {
        type: Number
    },
    driverCommission: {
        type:Number
    },
    disCountType:{
        type:String,
        enum:["PERCENTAGE","FLAT"]
    },
    isActive:{
        type:Boolean,
        default: false
    }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("commission", DocumentSchema);