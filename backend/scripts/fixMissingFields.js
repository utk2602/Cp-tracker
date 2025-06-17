const mongoose = require('mongoose');
const Student = require('../models/Student');
require('dotenv').config();

async function fixMissingFields() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find students missing department or year
    const studentsToFix = await Student.find({
      $or: [
        { department: { $exists: false } },
        { department: null },
        { department: '' },
        { year: { $exists: false } },
        { year: null }
      ]
    });

    console.log(`Found ${studentsToFix.length} students with missing fields`);

    if (studentsToFix.length === 0) {
      console.log('No students need fixing');
      return;
    }

    // Update each student with default values
    for (const student of studentsToFix) {
      const updates = {};
      
      if (!student.department) {
        updates.department = 'Computer Science';
        console.log(`Setting department for ${student.name} (${student.email})`);
      }
      
      if (!student.year) {
        updates.year = 1;
        console.log(`Setting year for ${student.name} (${student.email})`);
      }

      if (Object.keys(updates).length > 0) {
        await Student.findByIdAndUpdate(student._id, updates);
        console.log(`Updated student: ${student.name}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  fixMissingFields();
}

module.exports = fixMissingFields; 