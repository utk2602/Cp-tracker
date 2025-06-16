import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { format } from 'date-fns';

const ContestHistory = ({ contests }) => {
  const [filteredContests, setFilteredContests] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    applyFilter();
  }, [contests, filter]);

  const applyFilter = () => {
    const now = new Date();
    let cutoffDate;

    switch (filter) {
      case '7':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '365':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = new Date(0);
    }

    const filtered = contests
      .filter(contest => new Date(contest.contestDate) >= cutoffDate)
      .sort((a, b) => new Date(b.contestDate) - new Date(a.contestDate));

    setFilteredContests(filtered);

    const getRatingChangeColor =(change)=>{
        if(change>0) return 'success';
        if(change<0) return 'error';
        return 'default';
    };
    const getRatingChageText = (oldRating, newRating) => {
        const change = newRating - oldRating;
        return `${change > 0 ? '+' : ''}${change}`;
    };
  };

  return (
    <Box>
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contest</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Old Rating</TableCell>
              <TableCell>New Rating</TableCell>
              <TableCell>Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContests.map((contest) => (
              <TableRow key={contest._id}>
                <TableCell>
                  <Link
                    href={`https://codeforces.com/contest/${contest.contestId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: 'none' }}
                  >
                    {contest.contestName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Tooltip title={format(new Date(contest.contestDate), 'PPpp')}>
                    <span>{format(new Date(contest.contestDate), 'MMM d, yyyy')}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`#${contest.rank}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{contest.oldRating}</TableCell>
                <TableCell>{contest.newRating}</TableCell>
                <TableCell>
                  <Chip
                    label={getRatingChangeText(contest.oldRating, contest.newRating)}
                    size="small"
                    color={getRatingChangeColor(contest.newRating - contest.oldRating)}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredContests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary">
                    No contests found in the selected time period
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ContestHistory;
