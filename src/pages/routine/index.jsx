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
  const [userId, setUserId] = useState('user-123'); // Example user ID

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
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
        Class Routine
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Manage teacher assignments for each period
      </p>

      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="p-4 border border-gray-200 text-left text-lg font-semibold">
                Day
              </th>
              {periods.map((period, index) => (
                <th
                  key={index}
                  className="p-4 border border-gray-200 text-center"
                >
                  <div className="font-semibold">{period}</div>
                  <div className="text-sm text-gray-600">{times[index]}</div>
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
                <td className="p-4 border border-gray-200 font-semibold text-gray-800 text-left">
                  {day}
                </td>
                {periods.map((_, periodIndex) => (
                  <td
                    key={periodIndex}
                    className="p-2 border border-gray-200 text-center"
                  >
                    <select
                      value={schedule[dayIndex][periodIndex]}
                      className={`w-full p-3 border-none rounded-md text-sm focus:ring focus:ring-blue-400 hover:shadow-md transition ${
                        schedule[dayIndex][periodIndex] === ''
                          ? 'text-gray-400 font-medium'
                          : 'text-gray-900 font-medium'
                      }`}
                      onChange={(e) =>
                        handleChange(dayIndex, periodIndex, e.target.value)
                      }
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

      <div className="mt-6 text-center">
        <button
          onClick={saveSchedule}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Save Schedule
        </button>
      </div>

      <div className="mt-6 text-center text-gray-700 text-sm">
        <p>
          A total of {teachers.length} teachers are available for scheduling.
        </p>
      </div>
    </div>
  );
}
