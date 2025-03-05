import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const ScheduleGrid = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const morningPeriods = ['M1', 'M2', 'M3', 'M4', 'M5'];
  const dayPeriods = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'];
  const allPeriods = [...morningPeriods, ...dayPeriods];
  const timeSlots = [
    '6-7',
    '7-8',
    '8-9',
    '9-10',
    '10-11',
    '11-12',
    '12-1',
    '1-2',
    '2-3',
    '3-4',
    '4-5',
  ];

  const [checkedState, setCheckedState] = useState(
    days.reduce(
      (acc, day) => ({
        ...acc,
        [day]: timeSlots.reduce(
          (timeAcc, time) => ({ ...timeAcc, [time]: false }),
          {}
        ),
      }),
      {}
    )
  );

  const handleCheckboxChange = (day, timeSlot) => {
    setCheckedState((prev) => ({
      ...prev,
      [day]: { ...prev[day], [timeSlot]: !prev[day][timeSlot] },
    }));
    toast[checkedState[day][timeSlot] ? 'info' : 'success'](
      `${checkedState[day][timeSlot] ? 'Removed' : 'Added'}: ${day} ${timeSlot}`
    );
  };

  const resetCheckboxes = () => {
    setCheckedState(
      days.reduce(
        (acc, day) => ({
          ...acc,
          [day]: timeSlots.reduce(
            (timeAcc, time) => ({ ...timeAcc, [time]: false }),
            {}
          ),
        }),
        {}
      )
    );
    toast('Schedule cleared');
  };

  const selectedSlots = Object.entries(checkedState).flatMap(([day, times]) =>
    Object.entries(times)
      .filter(([_, isChecked]) => isChecked)
      .map(([time]) => `${day} ${time}`)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Availability Grid</h2>
        <button
          onClick={resetCheckboxes}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 transition-colors text-sm font-medium"
        >
          Reset Schedule
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className="p-3 border border-gray-200 text-left font-semibold">
                Day/Period
              </th>
              {allPeriods.map((period) => (
                <th
                  key={period}
                  className="p-3 border border-gray-200 font-semibold"
                >
                  {period}
                </th>
              ))}
            </tr>
            <tr>
              <th className="p-3 border border-gray-200 text-left font-semibold">
                Time Slot
              </th>
              {timeSlots.map((time) => (
                <th
                  key={time}
                  className="p-3 border border-gray-200 font-medium text-sm text-gray-600"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr
                key={day}
                className={
                  days.indexOf(day) % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }
              >
                <td className="p-3 border border-gray-200 font-semibold text-gray-800">
                  {day}
                </td>
                {timeSlots.map((time) => (
                  <td
                    key={`${day}-${time}`}
                    className="p-2 border border-gray-200 text-center"
                  >
                    <label
                      className={`inline-flex items-center justify-center w-8 h-8 rounded border cursor-pointer transition-all
                        ${
                          checkedState[day][time]
                            ? 'bg-blue-600 border-blue-700 shadow-sm'
                            : 'bg-white border-gray-300 hover:border-blue-300'
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checkedState[day][time]}
                        onChange={() => handleCheckboxChange(day, time)}
                      />
                      {checkedState[day][time] && (
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      )}
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlots.length > 0 && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Selected Time Slots:
          </h3>
          <div className="text-sm text-gray-600 font-medium">
            {selectedSlots.join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleGrid;
