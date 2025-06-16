const express = require('express');
const router = express.Router();
const cronController = require('../Controllers/cronController');

router.put('/schedule',cronController.updateCronSchedule);
router.get('/schedule',cronController.getCurrentSchedule);
router.post('/sync',cronController.triggerManualSync);
router.post('/sync/:studentId',cronController.triggerManualSync);

module.exports = router;
