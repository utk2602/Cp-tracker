import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import ContestHistory from '../components/ContestHistory';
import ProblemHistory from '../components/ProblemHistory';
import ProblemStats from '../components/ProblemStats';
import api from '../utils/api';

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [contests, setContests] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/students/${id}/profile`);
      setStudent(response.data.student);
      setContests(response.data.contests);
      setProblems(response.data.problems);
      setError(null);
    } catch (err) {
      setError('Failed to fetch student profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await api.post(`/cron/sync/${id}`);
      await fetchStudentProfile();
    } catch (err) {
      setError('Failed to sync student data');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Student not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {student.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Codeforces Handle: {student.codeforcesHandle}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Current Rating: {student.currentRating}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Max Rating: {student.maxRating}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1" color="textSecondary">
              Problems Solved: {problems.length}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Contests Participated: {contests.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      
      <ProblemStats studentId={id} />

      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Contest History
        </Typography>
        <ContestHistory contests={contests} />
      </Paper>

      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Problem History
        </Typography>
        <ProblemHistory problems={problems} />
      </Paper>
    </Container>
  );
};

export default StudentProfile; 