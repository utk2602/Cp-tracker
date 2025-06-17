const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    problemId: {
        type: String,
        required: true
    },
    problemName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    tags: [{
        type: String
    }],
    solvedDate: {
        type: Date,
        required: true
    },
    submissionId: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

problemSchema.index({ student: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model('Problem', problemSchema); 