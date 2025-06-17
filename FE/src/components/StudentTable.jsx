import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert';
import {
  Plus,
  Edit3,
  Trash2,
  Download,
  Clock,
  MoreHorizontal,
  Users,
  Trophy,
  Star,
  Calendar,
  Mail,
  Phone,
  Code
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import StudentFormModal from './StudentFormModal';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState('');
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchCronSchedule = async () => {
    try {
      const response = await api.get('/cron/schedule');
      setCurrentSchedule(response.data.schedule);
      setAvailableSchedules(response.data.availableSchedules);
    } catch (error) {
      console.error('Error fetching cron schedule:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchCronSchedule();
  }, []);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setOpenModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await api.get('/students/download/csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const handleScheduleChange = async (value) => {
    try {
      await api.put('/cron/schedule', { schedule: value });
      setCurrentSchedule(value);
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 2400) return 'bg-red-100 text-red-800 border-red-200';
    if (rating >= 2100) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (rating >= 1900) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (rating >= 1600) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rating >= 1400) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    if (rating >= 1200) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRatingTitle = (rating) => {
    if (rating >= 2400) return 'International Grandmaster';
    if (rating >= 2300) return 'Grandmaster';
    if (rating >= 2100) return 'International Master';
    if (rating >= 1900) return 'Candidate Master';
    if (rating >= 1600) return 'Expert';
    if (rating >= 1400) return 'Specialist';
    if (rating >= 1200) return 'Pupil';
    return 'Newbie';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Student Management
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage and track competitive programming students
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Schedule Selector */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <Select value={currentSchedule} onValueChange={handleScheduleChange}>
                <SelectTrigger className="w-48 border-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Select sync schedule" />
                </SelectTrigger>
                <SelectContent>
                  {availableSchedules.map((schedule) => (
                    <SelectItem key={schedule.value} value={schedule.value}>
                      {schedule.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleDownloadCSV}
                variant="outline"
                className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={handleAddStudent}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Students</p>
                  <p className="text-2xl font-bold text-blue-900">{students.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-green-900">
                    {students.length > 0 ? Math.round(students.reduce((sum, s) => sum + (s.currentRating || 0), 0) / students.length) : 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Highest Rating</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {students.length > 0 ? Math.max(...students.map(s => s.maxRating || 0)) : 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-900">Students List</h2>
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  {students.length} total
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/80">
                    <TableHead className="font-semibold text-gray-700">Student</TableHead>
                    <TableHead className="font-semibold text-gray-700">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-700">Codeforces</TableHead>
                    <TableHead className="font-semibold text-gray-700">Current Rating</TableHead>
                    <TableHead className="font-semibold text-gray-700">Max Rating</TableHead>
                    <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-16">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow 
                      key={student._id} 
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">Student ID: {student._id.slice(-6)}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{student.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-gray-400" />
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {student.codeforcesHandle}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getRatingColor(student.currentRating)} font-semibold`}
                          title={getRatingTitle(student.currentRating)}
                        >
                          {student.currentRating || 'Unrated'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${getRatingColor(student.maxRating)} font-semibold`}
                          title={getRatingTitle(student.maxRating)}
                        >
                          {student.maxRating || 'Unrated'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span title={new Date(student.lastUpdated).toLocaleString()}>
                            {formatDistanceToNow(new Date(student.lastUpdated), { addSuffix: true })}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={() => navigate(`/student/${student._id}`)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleEditStudent(student)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setStudentToDelete(student);
                                setDeleteDialogOpen(true);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {students.length === 0 && (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500 mb-6">Get started by adding your first student</p>
                  <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteStudent(studentToDelete?._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Student Form Modal */}
      <StudentFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        student={selectedStudent}
        onSave={() => {
          setOpenModal(false);
          fetchStudents();
        }}
      />
    </div>
  );
};

export default StudentTable;