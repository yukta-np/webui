import { useState, useEffect } from 'react';
const teachers = [
  'Sirish Koirala',
  'Basanta Poudel',
  'Kushal Niroula',
  'Kishor Giri',
];
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const periods = [
  'Period 1',
  'Period 2',
  'Period 3',
  'Period 4',
  'Period 5',
  'Period 6',
];
const times = ['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 1:00'];
export default function RoutineScheduler() {
  const [schedule, setSchedule] = useState(
    Array.from({ length: days.length }, () => Array(periods.length).fill(''))
  );
  const [activeCell, setActiveCell] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  const handleChange = (dayIndex, periodIndex, teacher) => {
    const newSchedule = schedule.map((day, dIdx) => 
      day.map((period, pIdx) => 
        dIdx === dayIndex && pIdx === periodIndex ? teacher : period
      )
    );
    setSchedule(newSchedule);
  };
  const handleCellFocus = (dayIndex, periodIndex) => {
    setActiveCell([dayIndex, periodIndex]);
  };
  const handleCellBlur = () => {
    setActiveCell(null);
  };
  const isCellActive = (dayIndex, periodIndex) => {
    return activeCell !== null && activeCell[0] === dayIndex && activeCell[1] === periodIndex;
  };
  return (
    <div className={`schedule-container ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      <h1 className="schedule-header">Class Routine</h1>
      <p className="schedule-subheader">Manage teacher assignments for each period</p>
      
      <div className="overflow-x-auto">
        <table className="schedule-table">
          <thead className="schedule-table-header">
            <tr>
              <th className="header-cell min-w-[120px]">Day</th>
              {periods.map((period, index) => (
                <th key={index} className="header-cell min-w-[150px]">
                  <div>{period}</div>
                  <div className="time-cell mt-1">{times[index]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={dayIndex} className={dayIndex % 2 === 0 ? 'bg-white' : 'bg-scheduler-light'}>
                <td className="day-cell p-4 font-medium">{day}</td>
                {periods.map((_, periodIndex) => (
                  <td 
                    key={periodIndex} 
                    className={`period-cell p-3 cell-highlight ${isCellActive(dayIndex, periodIndex) ? 'selected-cell' : ''}`}
                  >
                    <select
                      className={`scheduler-select w-full p-2 bg-transparent rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-scheduler-accent transition-all duration-200 ${
                        schedule[dayIndex][periodIndex] ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}
                      value={schedule[dayIndex][periodIndex]}
                      onChange={(e) => handleChange(dayIndex, periodIndex, e.target.value)}
                      onFocus={() => handleCellFocus(dayIndex, periodIndex)}
                      onBlur={handleCellBlur}
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>A total of {teachers.length} teachers are available for scheduling</p>
      </div>
    </div>
  );
}