const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');



router.get('/',studentController.getAllStudents);
router.post('/',studentController.createStudent);
router.put('/:id',studentController.updateStudent);
router.delete('/:id',studentController.deleteStudent);
router.get('/:id/profile',studentController.getStudentProfile);
router.get('/download/csv', studentController.downloadCSV);

router.post('/:id/toggle-reminders',studentController.toggleEmailReminders);

module.exports=router;