const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    contestId: {
        type: Number,
        required: true
    },
    contestName: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    oldRating: {
        type: Number,
        required: true
    },
    newRating: {
        type: Number,
        required: true
    },
    problemsSolved: {
        type: Number,
        default: 0
    },
    problemsUnsolved: {
        type: Number,
        default: 0
    },
    contestDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

contestSchema.index({ student: 1, contestId: 1 }, { unique: true });

module.exports = mongoose.model('Contest', contestSchema); 