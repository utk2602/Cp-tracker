const express = require('express');
const router = express.Router();
const cronController = require('../controllers/cronController');

// Get current cron schedule
router.get('/schedule', cronController.getSchedule);

// Update cron schedule
router.put('/schedule', cronController.updateSchedule);

// Trigger manual sync for all students
router.post('/sync', cronController.triggerManualSync);

// Sync individual student data (can also be triggered via triggerManualSync if studentId is provided)
router.post('/sync/:studentId', cronController.triggerManualSync);

module.exports = router; 