const express = require('express');
const router = express.Router();
const studentController = require('../Controllers/studentController');
const Student = require('../models/Student');

router.get('/', studentController.getAllStudents);

router.get('/:id', studentController.getStudentById);

router.post('/', studentController.createStudent);

router.put('/:id', studentController.updateStudent);

router.delete('/:id', studentController.deleteStudent);
router.get('/:id/profile', studentController.getStudentProfile);

router.get('/download/csv', studentController.downloadCSV);

router.post('/:id/toggle-reminders', studentController.toggleEmailReminders);

router.get('/:id/check', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ exists: false });
        }
        res.json({
            exists: true,
            student: {
                id: student._id,
                name: student.name,
                codeforcesHandle: student.codeforcesHandle
            }
        });
    } catch (error) {
        console.error('Error checking student:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
