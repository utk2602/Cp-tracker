import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';

const ProblemHistory = ({ problems: allProblems }) => {
  const [filter, setFilter] = useState('all'); 
  const [filteredProblems, setFilteredProblems] = useState([]);

  useEffect(() => {
    let filtered = allProblems;

    if (filter !== 'all') {
      filtered = allProblems.filter(problem => {
        const problemDate = new Date(problem.solvedDate);
        const now = new Date();
        const daysAgo = new Date(now.setDate(now.getDate() - parseInt(filter)));
        return problemDate >= daysAgo;
      });
    }

    setFilteredProblems(filtered);
  }, [allProblems, filter]);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'success',
      medium: 'warning',
      hard: 'error'
    };
    return colors[difficulty] || 'default';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Problem History</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="30">Last 30 Days</MenuItem>
            <MenuItem value="90">Last 90 Days</MenuItem>
            <MenuItem value="365">Last 365 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Problem Name</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Solved Date</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Contest</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow key={problem._id}>
                <TableCell>
                  <a
                    href={`https://codeforces.com/problemset/problem/${problem.problemId.slice(0, -1)}/${problem.problemId.slice(-1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {problem.problemName}
                  </a>
                </TableCell>
                <TableCell>
                  <Chip
                    label={problem.rating}
                    color={getDifficultyColor(problem.rating <= 1200 ? 'easy' : problem.rating <= 2000 ? 'medium' : 'hard')}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(problem.solvedDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {problem.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>{problem.contestName || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProblemHistory; 