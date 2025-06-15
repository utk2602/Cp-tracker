const { time } = require('console');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: String,
        required: true,
        unique: true,
    },
    codeforcesHandle:{
        type: String,
        required: true,
        unique: true,
    },
    currentRating:{
        type: Number,
        required: true,
        default: 0,
    },
    maxRating:{
        type: Number,
        required: true,
        default: 0,
    },
    lastUpdated:{
        type: Date,
        default: Date.now,
    }, 
    emailRemindersEnabled:{
        type: Boolean,
        default: true,
    },
    reminderCount:{
        type: Number,
        default: 0,     
    }
}, {   
    timestamps: true,
});
module.exports = mongoose.model('Student', studentSchema);
