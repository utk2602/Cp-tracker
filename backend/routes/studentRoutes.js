const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const Student = require('../models/Student');

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by ID
router.get('/:id', studentController.getStudentById);

// Create new student
router.post('/', studentController.createStudent);

// Update student
router.put('/:id', studentController.updateStudent);

// Delete student
router.delete('/:id', studentController.deleteStudent);

// Get student profile with contests and problems
router.get('/:id/profile', studentController.getStudentProfile);

// Download students data as CSV
router.get('/download/csv', studentController.downloadCSV);

// Toggle email reminders for a student
router.post('/:id/toggle-reminders', studentController.toggleEmailReminders);

// Check if student exists
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
