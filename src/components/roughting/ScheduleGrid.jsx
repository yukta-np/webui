import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const ScheduleGrid = () => {
  // Days of the week
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Time slots (morning and day periods)
  const morningPeriods = [
    'Morning 1',
    'Morning 2',
    'Morning 3',
    'Morning 4',
    'Morning 5',
  ];
  const dayPeriods = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];
  const allPeriods = [...morningPeriods, ...dayPeriods];

  // Time slots display
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

  // State to track checked boxes
  const [checkedState, setCheckedState] = useState(
    days.reduce((acc, day) => {
      acc[day] = {};
      timeSlots.forEach((time) => {
        acc[day][time] = false;
      });
      return acc;
    }, {})
  );

  // Handler for checkbox toggle
  const handleCheckboxChange = (day, timeSlot) => {
    setCheckedState((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: !prev[day][timeSlot],
      },
    }));

    if (!checkedState[day][timeSlot]) {
      toast.success(`Added: ${day} ${timeSlot}`);
    } else {
      toast.info(`Removed: ${day} ${timeSlot}`);
    }
  };

  // Reset all checkboxes
  const resetCheckboxes = () => {
    setCheckedState(
      days.reduce((acc, day) => {
        acc[day] = {};
        timeSlots.forEach((time) => {
          acc[day][time] = false;
        });
        return acc;
      }, {})
    );
    toast('All checkboxes reset');
  };

  // Get selected slots for summary
  const selectedSlots = Object.entries(checkedState).flatMap(([day, times]) =>
    Object.entries(times)
      .filter(([_, isChecked]) => isChecked)
      .map(([time]) => `${day} ${time}`)
  );

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        animation: 'fade-in 0.5s ease-in-out',
        padding: '16px',
      }}
    >
      {/* Reset Button */}
      <button
        onClick={resetCheckboxes}
        style={{
          padding: '8px 16px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '16px',
        }}
      >
        Reset
      </button>

      {/* Schedule Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#065f46', color: 'white' }}>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '500',
                border: '1px solid #064e3b',
              }}
            >
              Period
            </th>
            {allPeriods.map((period) => (
              <th
                key={period}
                style={{
                  padding: '12px',
                  fontWeight: '500',
                  border: '1px solid #064e3b',
                  position: 'relative',
                  minWidth: '120px',
                }}
              >
                {period}
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '8px',
                    pointerEvents: 'none',
                    opacity: '0.7',
                  }}
                >
                  <svg
                    style={{
                      width: '20px',
                      height: '20px',
                      fill: 'currentColor',
                    }}
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
              </th>
            ))}
          </tr>
          <tr style={{ backgroundColor: '#047857', color: 'white' }}>
            <th
              style={{
                padding: '12px',
                textAlign: 'left',
                fontWeight: '500',
                border: '1px solid #064e3b',
              }}
            >
              Time
            </th>
            {timeSlots.map((time) => (
              <th
                key={time}
                style={{
                  padding: '12px',
                  fontWeight: '500',
                  border: '1px solid #064e3b',
                }}
              >
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td
                style={{
                  padding: '12px',
                  fontWeight: '500',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                }}
              >
                {day}
              </td>
              {timeSlots.map((time) => (
                <td
                  key={`${day}-${time}`}
                  style={{
                    border: '1px solid #e5e7eb',
                    textAlign: 'center',
                    padding: '12px',
                  }}
                >
                  <label
                    style={{
                      display: 'inline-block',
                      width: '24px',
                      height: '24px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 200ms',
                      position: 'relative',
                      backgroundColor: checkedState[day][time]
                        ? '#10b981'
                        : 'white',
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        opacity: '0',
                        position: 'absolute',
                        inset: '0',
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                      checked={checkedState[day][time]}
                      onChange={() => handleCheckboxChange(day, time)}
                      aria-label={`Select ${day} ${time}`}
                    />
                    {checkedState[day][time] && (
                      <Check
                        size={16}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: 'white',
                        }}
                      />
                    )}
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Selected Slots Summary */}
      <div style={{ marginTop: '16px' }}>
        <h3 style={{ marginBottom: '8px' }}>Selected Slots:</h3>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {selectedSlots.map((slot, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>
              {slot}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduleGrid;
