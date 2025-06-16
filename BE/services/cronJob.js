const cron = require('node-cron');
const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Problem = require('../models/Problem');
const codeforcesAPI = require('./codeforcesAPI');
const emailService = require('./emailService');
const cronConfig = require('../configs/cronConfig');

class CronJobService {
    constructor() {
        this.job = null;
    }

    async syncStudentData(student) {
        try {
            const userInfo = await codeforcesAPI.getUserInfo(student.codeforcesHandle);
            const userRating = await codeforcesAPI.getUserRating(student.codeforcesHandle);
            const submissions = await codeforcesAPI.getUserSubmissions(student.codeforcesHandle);

            student.currentRating = userInfo.rating || 0;
            student.maxRating = userInfo.maxRating || 0;
            student.lastUpdated = new Date();
            await student.save();

            for (const contest of userRating) {
                await Contest.findOneAndUpdate(
                    { student: student._id, contestId: contest.contestId },
                    {
                        contestName: contest.contestName,
                        rank: contest.rank,
                        oldRating: contest.oldRating,
                        newRating: contest.newRating,
                        contestDate: new Date(contest.ratingUpdateTimeSeconds * 1000)
                    },
                    { upsert: true }
                );
            }
            const solvedProblems = new Set();
            for (const submission of submissions) {
                if (submission.verdict === 'OK' && !solvedProblems.has(submission.problem.contestId + submission.problem.index)) {
                    solvedProblems.add(submission.problem.contestId + submission.problem.index);
                    await Problem.findOneAndUpdate(
                        { student: student._id, problemId: submission.problem.contestId + submission.problem.index },
                        {
                            problemName: submission.problem.name,
                            rating: submission.problem.rating || 0,
                            tags: submission.problem.tags,
                            solvedDate: new Date(submission.creationTimeSeconds * 1000),
                            submissionId: submission.id
                        },
                        { upsert: true }
                    );
                }
            }

            const lastSubmission = submissions[0];
            if (lastSubmission) {
                const lastSubmissionDate = new Date(lastSubmission.creationTimeSeconds * 1000);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                if (lastSubmissionDate < sevenDaysAgo && student.emailRemindersEnabled) {
                    await emailService.sendInactivityReminder(student);
                    student.reminderCount += 1;
                    await student.save();
                }
            }
        } catch (error) {
            console.error(`Error syncing data for student ${student.codeforcesHandle}:`, error);
        }
    }

    async startCronJob() {
        if (this.job) {
            this.job.stop();
        }

        this.job = cron.schedule(cronConfig.defaultSchedule, async () => {
            console.log('Starting scheduled data sync...');
            const students = await Student.find();
            
            for (const student of students) {
                await this.syncStudentData(student);
            }
            
            console.log('Scheduled data sync completed.');
        }, cronConfig.options);
    }

    updateSchedule(newSchedule) {
        if (this.job) {
            this.job.stop();
        }

        this.job = cron.schedule(newSchedule, async () => {
            console.log('Starting scheduled data sync with new schedule...');
            const students = await Student.find();
            
            for (const student of students) {
                await this.syncStudentData(student);
            }
            
            console.log('Scheduled data sync completed.');
        }, cronConfig.options);
    }
}

module.exports = new CronJobService(); 