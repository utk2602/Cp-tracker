const { time } = require('console');
const mongoose = require('mongoose');
const { type } = require('os');

const problemSchema = new mongoose.Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    problemId:{
        type: String,
        required: true, 
    },
    problemName:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
    tags:[{
        type: String,
        required: true,
    }],
    solvedDate:{
        type: Date,
        required:true,
    },
    submissionId:{
        type: Number,
        required: true,
    }
},{
    timestamps: true,
});

problemSchema.index({ student: 1, problemId: 1 }, { unique: true });
const Problem = mongoose.model('Problem', problemSchema);