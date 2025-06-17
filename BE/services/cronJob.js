const cron = require('node-cron');
const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Problem = require('../models/Problem');
const codeforcesAPI = require('./codeforcesAPI');
const emailService = require('./emailService');
const cronConfig = require('../config/cronConfig');
const AnalyticsService = require('./analyticsService');

let cronJob = null;

const startCronJob = () => {
    if (cronJob) {
        cronJob.stop();
    }

    console.log(`Starting cron job with schedule: ${cronConfig.schedule}`);
    cronJob = cron.schedule(cronConfig.schedule, async () => {
        try {
            console.log('Running scheduled data sync...');
            const students = await Student.find({});
            console.log(`Found ${students.length} students to sync`);

            for (const student of students) {
                try {
                    await syncStudentData(student._id);
                } catch (error) {
                    console.error(`Error syncing data for student ${student._id}:`, error);
                }
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    }, {
        timezone: cronConfig.timezone
    });
};

const updateSchedule = async (newSchedule) => {
    try {
        console.log(`Updating cron schedule to: ${newSchedule}`);
        cronConfig.schedule = newSchedule;
        startCronJob();
        return true;
    } catch (error) {
        console.error('Error updating cron schedule:', error);
        throw error;
    }
};

const syncStudentData = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            throw new Error('Student not found');
        }

        console.log(`Syncing data for student: ${student.name} (${student.codeforcesHandle})`);

        const [userInfo, userRatings] = await Promise.all([
            codeforcesAPI.getUserInfo(student.codeforcesHandle),
            codeforcesAPI.getUserRating(student.codeforcesHandle)
        ]);

        if (!userInfo) {
            throw new Error('Failed to fetch user info');
        }

        student.currentRating = userInfo.rating || 0;
        student.maxRating = Math.max(student.maxRating || 0, userInfo.rating || 0);
        student.lastUpdated = new Date();


        if (userRatings && userRatings.length > 0) {
            student.totalProblemsSolved = userRatings.length;

            const recentContests = userRatings.slice(0, 10);
            
            for (const rating of recentContests) {
                try {
                    const existingContest = await Contest.findOne({
                        student: student._id,
                        contestId: rating.contestId
                    });

                    if (!existingContest) {
                        const contest = new Contest({
                            student: student._id,
                            contestId: rating.contestId,
                            contestName: rating.contestName,
                            rank: rating.rank,
                            oldRating: rating.oldRating,
                            newRating: rating.newRating,
                            problemsSolved: 0, 
                            problemsUnsolved: 0, 
                            contestDate: new Date(rating.ratingUpdateTimeSeconds * 1000),
                        });
                        await contest.save();
                    }
                } catch (error) {
                    console.error(`Error processing contest ${rating.contestId}:`, error);
                }
            }
        }

        const submissions = await codeforcesAPI.getUserSubmissions(student.codeforcesHandle, 100);
        if (submissions) {
            const solvedProblemIds = new Set();
            const problemSubmissionMap = new Map();

            for (const submission of submissions) {
                if (submission.verdict === 'OK') {
                    const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
                    
                    if (!problemSubmissionMap.has(problemId) || 
                        submission.creationTimeSeconds < problemSubmissionMap.get(problemId).creationTimeSeconds) {
                        problemSubmissionMap.set(problemId, submission);
                    }
                    solvedProblemIds.add(problemId);
                }
            }

            for (const [problemId, submission] of problemSubmissionMap) {
                try {
                    const existingProblem = await Problem.findOne({
                        student: student._id,
                        problemId: problemId
                    });

                    if (!existingProblem) {
                        const problem = new Problem({
                            student: student._id,
                            problemId: problemId,
                            problemName: submission.problem.name,
                            rating: submission.problem.rating || 0,
                            tags: submission.problem.tags || [],
                            solvedDate: new Date(submission.creationTimeSeconds * 1000),
                            submissionId: submission.id
                        });
                        await problem.save();
                    }
                } catch (error) {
                    console.error(`Error processing problem ${problemId}:`, error);
                }
            }
        }

        await student.save();
        console.log(`Successfully synced data for student: ${student.name}`);

        return student;
    } catch (error) {
        console.error('Error syncing student data:', error);
        throw error;
    }
};

module.exports = {
    startCronJob,
    updateSchedule,
    syncStudentData
}; 