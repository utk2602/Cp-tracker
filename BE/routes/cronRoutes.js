const express = require('express');
const router = express.Router();
const cronController = require('../Controllers/cronController');

router.get('/schedule', cronController.getSchedule);

router.put('/schedule', cronController.updateSchedule);

router.post('/sync', cronController.triggerManualSync);

router.post('/sync/:studentId', cronController.triggerManualSync);

module.exports = router; 