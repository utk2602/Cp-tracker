const cron = require('node-cron');
const Student = require('../models/Student');
const cronJobService = require('../services/cronJob');
const cronConfig = require('../config/cronConfig');

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
        console.log('Starting manual sync for student ID:', studentId);
        
        if (studentId) {
            console.log('Finding student in database...');
            const student = await Student.findById(studentId);
            
            if (!student) {
                console.log('Student not found in database');
                return res.status(404).json({ message: 'Student not found' });
            }
            
            console.log('Student found:', {
                id: student._id,
                name: student.name,
                handle: student.codeforcesHandle
            });

            try {
                console.log('Starting sync process...');
                await cronJobService.syncStudentData(student);
                console.log('Sync completed successfully');
                res.json({ message: 'Student data sync completed' });
            } catch (syncError) {
                console.error('Error during sync process:', syncError);
                                if (syncError.message.includes('Codeforces is temporarily blocking requests')) {
                    return res.status(503).json({ 
                        message: 'Codeforces is temporarily blocking requests. Please try again later.',
                        error: syncError.message 
                    });
                }
                
                throw syncError;
            }
        } else {
        
            const students = await Student.find();
            for (const student of students) {
                await cronJobService.syncStudentData(student);
            }
            res.json({ message: 'All students data sync completed' });
        }
    } catch (error) {
        console.error('Error in triggerManualSync:', {
            message: error.message,
            stack: error.stack,
            studentId: req.params.studentId
        });
        
        if (error.message.includes('Codeforces is temporarily blocking requests')) {
            return res.status(503).json({ 
                message: 'Codeforces is temporarily blocking requests. Please try again later.',
                error: error.message 
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to sync student data',
            error: error.message 
        });
    }
};

exports.getSchedule = async (req, res) => {
  try {
    res.json({
      schedule: cronConfig.schedule,
      availableSchedules: cronConfig.availableSchedules
    });
  } catch (error) {
    console.error('Error getting cron schedule:', error);
    res.status(500).json({ message: 'Error getting cron schedule' });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    if (!schedule) {
      return res.status(400).json({ message: 'Schedule is required' });
    }

    if (!cronConfig.availableSchedules.some(s => s.value === schedule)) {
      return res.status(400).json({ message: 'Invalid schedule format' });
    }

    await cronJobService.updateSchedule(schedule);
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    console.error('Error updating cron schedule:', error);
    res.status(500).json({ message: 'Error updating cron schedule' });
  }
};

exports.syncStudentData = async (req, res) => {
  try {
    const { studentId } = req.params;
    await cronJobService.syncStudentData(studentId);
    res.json({ message: 'Student data synced successfully' });
  } catch (error) {
    console.error('Error syncing student data:', error);
   
    if (error.message.includes('Codeforces is temporarily blocking requests')) {
      return res.status(503).json({ 
        message: 'Codeforces is temporarily blocking requests. Please try again later.',
        error: error.message 
      });
    }
    
    res.status(500).json({ message: 'Error syncing student data' });
  }
}; 