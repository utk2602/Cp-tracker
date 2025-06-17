require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const cronRoutes = require('./routes/cronRoutes');
const cronJobService = require('./services/cronJob');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/students', studentRoutes);
app.use('/api/cron', cronRoutes);

cronJobService.startCronJob();

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 