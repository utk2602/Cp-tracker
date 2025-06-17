import React,{useState,useEffect} from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Tooltip,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek, addDays, parseISO } from 'date-fns';
import api from '../utils/api';



const ProblemStats=({studentId})=>{
    const theme = useTheme();
    const[problem,setProblems]=useState([]);
    const[filter,setFilter]=useState('30');
    const [loading,setLoading] = useState(true);
    const[error,setError]=useState(null);
    const[stats,setStats] = useState({
        mostDifficult:null,
        totalSolved:0,
        averageRating:0,
        averagePerDay:0,
        ratingDistribution:[],
        heatmapData:[]
    });
    useEffect(()=>{
        fetchProblems();
    },[studentId]);
    useEffect(()=>{
        if(problems.length>0){
            calculateStats();
        }
    },[problems,filter]);
    const fetchProblems=async()=>{
        try{
            setLoading(true);
            setError(null);
            const response = await api.get(`/students/${studentId}/problems`);
            const processedProblems = response.data.map(problem=>({
                ...problem,
                solvedAt:parseISO(problem.solvedAt)
            }));
            setProblems(processedProblems);
        }
        catch(error){
            console.error('Error fetching problems:',error);
            setError('Failed to fetch problem data.Please try again later.');
        }
        finally{
            setLoading(false);
        }
    };
    const  calculateStats=()=>{
        const cutoffDate=subDays(new Date(),days);
        const filteredProblems = problems.filter(problem=>
            problem.solvedAt>=cutoffDate
        );
        const sortedByRating = [filteredProblems].sort((a,b)=>b.rating-a.rating);
        const mostDifficult= sortedByRating[0] || null;
        const totalSolved=  filteredProblems.length;
        const averageRating=filteredProblems.reduce((sum,problem)=>
        sum+(problem.rating||0),0)/totalSolved||0;
        const averagePerDay=totalSolved/days;
        const ratingRanges = [
      { min: 0, max: 800, label: '0-800' },
      { min: 800, max: 1000, label: '800-1000' },
      { min: 1000, max: 1200, label: '1000-1200' },
      { min: 1200, max: 1400, label: '1200-1400' },
      { min: 1400, max: 1600, label: '1400-1600' },
      { min: 1600, max: 1800, label: '1600-1800' },
      { min: 1800, max: 2000, label: '1800-2000' },
      { min: 2000, max: 2200, label: '2000-2200' },
      { min: 2200, max: 2400, label: '2200-2400' },
      { min: 2400, max: Infinity, label: '2400+' }
    ];
     const ratingDistribution =  ratingRanges.map(range=>({
        range:range.label,
        count: filteredProblems.filter(problem=>
            problem.rating >= range.min && problem.rating <range.max
        ).length
     }));
     const today = new Date();
     const startDate = startOfWeek(subDays(today.days));
     const endDate = endOfWeek(today);
     const dateRange= eachDayOfInterval({ start:startDate , end:endDate});
     const heatmapData = dateRange.map(date => ({
        date:format(date,'yyyy-MM-dd'),
        count: filteredProblems.filter(problem=>
            format(problem.solvedAt,'yyyy-MM-dd') === format(date , 'yyyy-MM-dd')
        ).length
     }));
     setStats({
        mostDifficult,
        totalSolved,
        averageRating,
        averagePerDay,
        ratingDistribution,
        heatmapData
     });
    };
    const getHeatmapColor = (count)=>{
        if(count === 0) return theme.palette.grey[100];
        if (count <= 2) return '#9be9a8';
        if (count <= 4) return '#40c463';
        if (count <= 6) return '#30a14e';
        return '#216e39';
    };
    const renderHeatmap =()=>{
        const weeks =[];
        let currentWeek=[];
        stats.heatmapData.forEach((day,index)=>{
            currentWeek.push(day);
            if((index+1)%7===0){
                weeks.push([...currentWeek]);
                currentWeek=[];
            }
        });
        return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {weeks.map((week, weekIndex) => (
          <Box key={weekIndex} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {week.map((day) => (
              <Tooltip
                key={day.date}
                title={`${day.date}: ${day.count} problems solved`}
                arrow
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: getHeatmapColor(day.count),
                    borderRadius: 0.5,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      boxShadow: 1
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        ))}
      </Box>
    );
    };
    if(loading){
        return (
            <Box sc={{ display:'flex',justifyContent:'center',p:3}}>
             <CircularProgress/>
            </Box>
        );
    }
    if(error){
        return (
            <Alert severity="error" sx={{m:2}}>
                {error}
            </Alert>
        );
    }
    return(
        <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Problem Solving Statistics
        </Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Time Period"
            size="small"
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Most Difficult Problem
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {stats.mostDifficult ? (
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>
                    {stats.mostDifficult.name}
                    <Typography component="span" variant="body2" color="textSecondary">
                      {' '}({stats.mostDifficult.rating})
                    </Typography>
                  </Box>
                ) : 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Problems Solved
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                {stats.totalSolved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Rating
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.info.main }}>
                {Math.round(stats.averageRating)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Problems/Day
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.warning.main }}>
                {stats.averagePerDay.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Rating Distribution Chart */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Problems Solved by Rating
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="range" 
                    stroke={theme.palette.text.secondary}
                    tick={{ fill: theme.palette.text.secondary }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    tick={{ fill: theme.palette.text.secondary }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Heatmap */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Submission Heatmap
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              {renderHeatmap()}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 1 }}>
              <Typography variant="caption" color="textSecondary">Less</Typography>
              {[0, 2, 4, 6].map((count) => (
                <Box
                  key={count}
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: getHeatmapColor(count),
                    borderRadius: 0.5
                  }}
                />
              ))}
              <Typography variant="caption" color="textSecondary">More</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
    );
};


export default ProblemStats;