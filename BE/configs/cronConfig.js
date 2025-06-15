const cronConfig = {
    defaultSchedule: '0 2 * * *',
    timezone: 'IST',
    options: {
        scheduled: true,
        timezone: 'Asia/Kolkata',
        runOnInit: true,
    }
};

module.exports = cronConfig; 