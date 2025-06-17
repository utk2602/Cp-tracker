import { useMemo } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

function SubmissionHeatmap({ submissions }) {
  // The 'submissions' prop is already in the format needed by CalendarHeatmap:
  // { date: 'YYYY-MM-DD', count: N }
  const heatmapData = useMemo(() => {
    return submissions || []; // Directly use the prop
  }, [submissions]);

  const getClassForValue = (value) => {
    if (!value || !value.count) {
      return 'color-empty';
    }
    
    const count = value.count;
    if (count >= 10) return 'color-scale-4';
    if (count >= 7) return 'color-scale-3';
    if (count >= 4) return 'color-scale-2';
    return 'color-scale-1';
  };

  const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) {
      return null;
    }
    
    return {
      'data-tip': value.count 
        ? `${value.date}: ${value.count} submission${value.count > 1 ? 's' : ''}`
        : `${value.date}: No submissions`
    };
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Submission Activity
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No submission data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Submission Activity (Last 365 Days)
      </h3>
      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
          endDate={new Date()}
          values={heatmapData}
          classForValue={getClassForValue}
          tooltipDataAttrs={getTooltipDataAttrs}
          showWeekdayLabels={true}
          weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
          monthLabels={[
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ]}
        />
      </div>
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
          <div className="w-3 h-3 bg-blue-800 rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

export default SubmissionHeatmap; 