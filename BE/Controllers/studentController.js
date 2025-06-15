const Student = require('../models/Student');
const Problem = require('../models/Problem');
const Contest = require('../models/Contest');
const{Parser } = require('json2csv');

exports.getAllStudents = async(req,res)=>{
    try{
        const students = await Student.find().select('-__v');
        res.json(student);
    }catch(error){
        res.status(500).json({
            message:ErrorEvent.message
        });
    }
};

exports.createStudent = async(req,res) =>{
    try{
        const student = new Student(req.body);
        await student.save();
        
        res.status(201).json(student);
    }
    catch(error){
        res.status(400).json({
            message:error.message
        });
    }
};

exports.updateStudent = async(req,res)=>{
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        if (req.body.codeforcesHandle && req.body.codeforcesHandle !== student.codeforcesHandle){
            student.codeforcesHandle= req.body.codeforcesHandle;
            await student.save();
            
        }else{
            Object.assign(student,req.body);
            await student.save();
        }
        res.json(student);
    }
    catch(error){
        res.status(400).json({
            message:error.message
        });
    }
};
exports.deleteStudent= async(req,res)=>{
    try{
        const student = await Student.findByIdAndDelete(req.params.id);
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        await  Contest.deleteMany({ student: student._id });
        await Problem.deleteMany({ student:student._id});
        await student.remove();
        res.json({
            message:"Student deleted successfully"
        })
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};
exports.getStudentProfile = async(req,res)=>{
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        const contests = await Contest.find({ student: student._id }).sort({ date: -1 });
        const problems = await Problem.find({ student:student._id}).sort({solvedDate:-1});
        res.json({
            student,
            contests,
            problems
        });
    }
    catch(erro){
        res.status(500).json({
            message:error.message
        });
    }
};

exports.downloadCSV = async(req,res)=>{
    try{
        const students = await Student.find().select('-__v');
        const fields=['name',
            'email',
            'phone',
            'codeforcesHandle',
            'currentRating',
            'maxRating',
            'lastUpdated'
        ];
        const parser = new Parser({fields});
        const csv = parser.parse(students);

        res.header('Content-Type','text/csv');
        res.attachment('students.csv');
        res.send(csv);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
};

exports.toggleEmailReminders = async(req,res) =>{
    try{
        const student = await Student.findById(req.params.id);
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        student.emailRemindersEnabled = !student.emailRemindersEnabled;
        await student.save();
        res.json({
            message:`Email reminders ${student.emailRemindersEnabled ? 'enabled' : 'disabled'} successfully`,
            emailRemindersEnabled: student.emailRemindersEnabled
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}