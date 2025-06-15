const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  contestId: {
    type: Number,
    required: true,
  },
  contestName: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
    min: 1,
  },
  oldrate: {
    type: Number,
    required: true,
  },
  newrate: {
    type: Number,
    required: true,
  },
  unsolved: {
    type: [String],  
    default: [],
  },
  contestDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, 
});

contestSchema.index({ Student: 1, contestId: 1 }, { unique: true });

const Contest = mongoose.model('Contest', contestSchema);
module.exports = Contest;
