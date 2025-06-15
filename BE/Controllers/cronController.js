const cronJobService = require('../services/cronJob');
const cronConfig = require('../configs/cronConfig');

exports.updateCronSchedule = async (req, res) => {
    try {
        const { schedule } = req.body;
       
        if (!cron.validate(schedule)) {
            return res.status(400).json({ message: 'Invalid cron schedule format' });
        }

        cronJobService.updateSchedule(schedule);
        res.json({ 
            message: 'Cron schedule updated successfully',
            schedule
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCurrentSchedule = async (req, res) => {
    try {
        res.json({
            schedule: cronConfig.defaultSchedule,
            timezone: cronConfig.timezone
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.triggerManualSync = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (studentId) {
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            await cronJobService.syncStudentData(student);
            res.json({ message: 'Student data sync completed' });
        } else {
            const students = await Student.find();
            for (const student of students) {
                await cronJobService.syncStudentData(student);
            }
            res.json({ message: 'All students data sync completed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 