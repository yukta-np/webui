import { useState } from 'react';

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
const times = [
  '7:00 - 8:00',
  '8:00 - 9:00',
  '9:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 1:00',
];

export default function RoutineScheduler() {
  const [schedule, setSchedule] = useState(
    Array.from({ length: days.length }, () => Array(periods.length).fill(''))
  );
  const [userId, setUserId] = useState('user-123');

  const handleChange = (dayIndex, periodIndex, teacher) => {
    const newSchedule = schedule.map((day, dIdx) =>
      day.map((period, pIdx) =>
        dIdx === dayIndex && pIdx === periodIndex ? teacher : period
      )
    );
    setSchedule(newSchedule);
  };

  const saveSchedule = async () => {
    const formattedSchedule = {
      userId,
      schedule: days.map((day, dayIndex) => ({
        day,
        periods: periods.map((period, periodIndex) => ({
          period,
          time: times[periodIndex],
          teacher: schedule[dayIndex][periodIndex] || null,
        })),
      })),
    };

    console.log('Saving schedule:', formattedSchedule);

    // Send data to API or database
    try {
      const response = await fetch('/api/save-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedSchedule),
      });

      if (response.ok) {
        alert('Schedule saved successfully!');
      } else {
        alert('Failed to save schedule.');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error saving schedule.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Class Routine Manager
        </h1>
        <p className="text-gray-600 text-sm">
          Manage teacher assignments for academic periods
        </p>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="p-3 border border-gray-200 text-left font-semibold w-40">
                Day
              </th>
              {periods.map((period, index) => (
                <th
                  key={index}
                  className="p-3 border border-gray-200 text-center"
                >
                  <div className="font-semibold text-sm">{period}</div>
                  <div className="text-xs text-gray-600 mt-1">{times[index]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr
                key={dayIndex}
                className={dayIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <td className="p-3 border border-gray-200 font-medium text-gray-800">
                  {day}
                </td>
                {periods.map((_, periodIndex) => (
                  <td
                    key={periodIndex}
                    className="p-2 border border-gray-200"
                  >
                    <select
                      value={schedule[dayIndex][periodIndex]}
                      className={`w-full px-3 py-2 rounded-md border-none text-sm focus:ring-2 focus:ring-blue-400 transition-all
                        ${
                          schedule[dayIndex][periodIndex] === '' 
                            ? 'text-gray-400 bg-gray-50 hover:bg-gray-100' 
                            : 'text-gray-800 bg-white hover:bg-gray-50'
                        }`}
                      onChange={(e) =>
                        handleChange(dayIndex, periodIndex, e.target.value)
                      }
                    >
                      <option value="">Select</option>
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

      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {teachers.length} teachers available
        </div>
        <button
          onClick={saveSchedule}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium shadow-sm"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
}
