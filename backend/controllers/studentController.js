const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Problem = require('../models/Problem');
const { Parser } = require('json2csv');
const cronJobService = require('../services/cronJob');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-__v');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new student and trigger sync
exports.createStudent = async (req, res) => {
    try {
        // Validate required fields
        const { name, email, phone, codeforcesHandle } = req.body;
        
        if (!name || !email || !phone || !codeforcesHandle) {
            return res.status(400).json({ 
                message: 'Required fields: name, email, phone, codeforcesHandle' 
            });
        }

        const student = new Student(req.body);
        await student.save();

        // Trigger immediate sync
        await cronJobService.syncStudentData(student);

        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update student and optionally re-sync if handle changed
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Validate required fields if they're being updated
        const { name, email, phone, codeforcesHandle } = req.body;
        const updatedFields = { name, email, phone, codeforcesHandle };
        
        // Check if any required field is being set to empty/null
        for (const [field, value] of Object.entries(updatedFields)) {
            if (value !== undefined && (!value || value === '')) {
                return res.status(400).json({ 
                    message: `${field} cannot be empty` 
                });
            }
        }

        const { codeforcesHandle: newHandle } = req.body;

        if (newHandle && newHandle !== student.codeforcesHandle) {
            student.codeforcesHandle = newHandle;
            await student.save();
            await cronJobService.syncStudentData(student);
        } else {
            Object.assign(student, req.body);
            await student.save();
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete student and associated data
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await Contest.deleteMany({ student: student._id });
        await Problem.deleteMany({ student: student._id });
        await Student.deleteOne({ _id: student._id });

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get student profile including contests and problems
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const contests = await Contest.find({ student: student._id }).sort({ contestDate: -1 });
        const problems = await Problem.find({ student: student._id }).sort({ solvedDate: -1 });

        // Transform contests to match frontend expectations
        const transformedContests = contests.map(contest => ({
            id: contest._id,
            name: contest.contestName,
            date: contest.contestDate,
            rank: contest.rank,
            newRating: contest.newRating,
            oldRating: contest.oldRating,
            problemsSolved: contest.problemsSolved,
            problemsUnsolved: contest.problemsUnsolved
        }));

        // Transform problems to match frontend expectations
        const transformedProblems = problems.map(problem => ({
            id: problem._id,
            name: problem.problemName,
            rating: problem.rating,
            solvedAt: problem.solvedDate,
            tags: problem.tags
        }));

        // Create submissions data for heatmap (group by date)
        const submissionsByDate = {};
        problems.forEach(problem => {
            // Ensure solvedDate is a valid Date object before proceeding
            if (problem.solvedDate && !isNaN(new Date(problem.solvedDate)) && new Date(problem.solvedDate).getTime() > 0) {
                const date = new Date(problem.solvedDate).toISOString().split('T')[0];
                submissionsByDate[date] = (submissionsByDate[date] || 0) + 1;
            } else {
                console.warn('Invalid solvedDate found for problem:', problem.problemId, problem.problemName, problem.solvedDate);
            }
        });

        const submissions = Object.entries(submissionsByDate).map(([date, count]) => ({
            date,
            count
        }));

        console.log('Backend sending profile data:');
        console.log('Contests:', transformedContests);
        console.log('Problems:', transformedProblems);
        console.log('Submissions:', submissions);

        res.json({
            student: { ...student.toObject(), totalProblemsSolved: student.totalProblemsSolved },
            contests: transformedContests,
            problems: transformedProblems,
            submissions
        });
    } catch (error) {
        console.error('Error in getStudentProfile:', error);
        res.status(500).json({ message: error.message });
    }
};

// Export student data as CSV
exports.downloadCSV = async (req, res) => {
    try {
        const students = await Student.find().select('-__v');

        const fields = [
            'name',
            'email',
            'phone',
            'codeforcesHandle',
            'currentRating',
            'maxRating',
            'lastUpdated'
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(students);

        res.header('Content-Type', 'text/csv');
        res.attachment('students.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle email reminders for a student
exports.toggleEmailReminders = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.emailRemindersEnabled = !student.emailRemindersEnabled;
        await student.save();

        res.json({ 
            message: `Email reminders ${student.emailRemindersEnabled ? 'enabled' : 'disabled'}`,
            emailRemindersEnabled: student.emailRemindersEnabled
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
