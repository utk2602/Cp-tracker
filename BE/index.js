const cors = require('cors');
const express = require('express');
const connectDb = require('./configs/db');
const studentRoutes = require('./routes/studentRoutes');
const cronRoutes =  require('./routes/cronRoutes');
const CronJobService=require('./services/cronJob');


const app  =  express();
connectDb();

app.use(cors());
app.use(express.json());

app.use('/api/students',studentRoutes);
app.use('/api/cron',cronRoutes);


CronJobService.startCronJob();

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({
        message:'Something went wrong!'
    });
});

const PORT = process.env.PORT ||  5000;
app.listen(PORT,()=>{
    console.log(`Server is Running on port ${PORT}`);
});