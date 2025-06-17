const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    codeforcesHandle: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        default: 'Computer Science'
    },
    year: {
        type: Number,
        default: 1
    },
    currentRating: {
        type: Number,
        default: 0
    },
    maxRating: {
        type: Number,
        default: 0
    },
    totalProblemsSolved: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    maxStreak: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: Date.now
    },
    averageRatingChange: {
        type: Number,
        default: 0
    },
    contestParticipationRate: {
        type: Number,
        default: 0
    },
    problemSolvingRate: {
        type: Number,
        default: 0
    },
    achievements: [{
        type: String,
        enum: [
            'first_contest',
            'rating_1000',
            'rating_1500',
            'rating_2000',
            'streak_7',
            'streak_30',
            'problems_50',
            'problems_100',
            'problems_200',
            'contest_master',
            'speed_solver',
            'consistency_king'
        ]
    }],
    performanceHistory: [{
        date: Date,
        rating: Number,
        problemsSolved: Number,
        contestsParticipated: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    emailRemindersEnabled: {
        type: Boolean,
        default: true
    },
    reminderCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema); 