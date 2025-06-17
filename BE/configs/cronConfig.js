module.exports = {
    schedule: '0 2 * * *', // Default: Every day at 2 AM
    timezone: 'UTC',
    availableSchedules: [
        {
            label: 'Every day at 2 AM',
            value: '0 2 * * *'
        },
        {
            label: 'Every day at 12 AM',
            value: '0 0 * * *'
        },
        {
            label: 'Every 6 hours',
            value: '0 */6 * * *'
        },
        {
            label: 'Every 12 hours',
            value: '0 */12 * * *'
        },
        {
            label: 'Every hour',
            value: '0 * * * *'
        }
    ]
}; 