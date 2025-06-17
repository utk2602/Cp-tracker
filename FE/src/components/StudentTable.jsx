import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  IconButton,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import api from '../utils/api';
import StudentFormModal from './StudentFromModal';

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentSchedule, setCurrentSchedule] = useState('');
  const [availableSchedules, setAvailableSchedules] = useState([]);
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
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
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

  const handleScheduleChange = async (event) => {
    try {
      await api.put('/cron/schedule', { schedule: event.target.value });
      setCurrentSchedule(event.target.value);
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'codeforcesHandle', headerName: 'Codeforces Handle', flex: 1 },
    { field: 'currentRating', headerName: 'Current Rating', flex: 1 },
    { field: 'maxRating', headerName: 'Max Rating', flex: 1 },
    {
      field: 'lastUpdated',
      headerName: 'Last Updated',
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={new Date(params.value).toLocaleString()}>
          <span>{formatDistanceToNow(new Date(params.value), { addSuffix: true })}</span>
        </Tooltip>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => navigate(`/student/${params.row._id}`)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleEditStudent(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteStudent(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Students</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sync Schedule</InputLabel>
            <Select
              value={currentSchedule}
              onChange={handleScheduleChange}
              label="Sync Schedule"
              startAdornment={<ScheduleIcon sx={{ mr: 1 }} />}
            >
              {availableSchedules.map((schedule) => (
                <MenuItem key={schedule.value} value={schedule.value}>
                  {schedule.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddStudent}
          >
            Add Student
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadCSV}
          >
            Download CSV
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={students}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        disableSelectionOnClick
        getRowId={(row) => row._id}
      />
      <StudentFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        student={selectedStudent}
        onSave={() => {
          setOpenModal(false);
          fetchStudents();
        }}
      />
    </Box>
  );
};

export default StudentTable; 