const cron = require('node-cron');
const Student = require('../models/Student');
const Contest = require('../models/Contest');
const Problem = require('../models/Problem');
const emailService = require('./emailService');
const cronConfig = require('../configs/cronConfig');
const codeforcesAPI= require('../codeforcesAPI');

class CronJobService{
    constructor(){
        this.job = null;
    }
    async  syncStudentData(student){
        try{
            const userInfo = await codeforcesAPI.getUserInfo(student.codeforcesHandle);
            const userRating = await codeforcesAPI.getUserRating(student.codeforcesHandle);
            const submissions = await codeforcesAPI.getUserSubmissions(student.codeforcesHandle);

            
        }
    }
}