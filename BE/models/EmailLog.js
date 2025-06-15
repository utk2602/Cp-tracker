const mongoose = require('mongoose');
const { type } = require('os');

const emailLogSchema = new mongoose.Schema({
    student:{
        type :mongoose.Schema.Types.ObjectId,
        ref:'Strudent',
        required:true
    },
    emialType:{
        type: String,
        enum:['INACTIVITY_REMINDER'],
        required:true
    },
    sentAt:{
        type:Date,
        default:Date.now
    },
    status:{
        type:String,
        enum:['SENT','FAILED'],
        required:true
    },
    errorMessage:{
        type:String
    }
},{
    timestamps:true
});

module.exports = mongoose.model('EmailLog', emailLogSchema);