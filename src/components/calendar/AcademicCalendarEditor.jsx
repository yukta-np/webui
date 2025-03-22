import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Tooltip } from 'antd';
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import NepaliDate from 'nepali-date-converter';
import dayjs from 'dayjs';

const { Option } = Select;

const AcademicCalendarEditor = () => {
  const [currentMonth, setCurrentMonth] = useState(new NepaliDate());
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(
    new NepaliDate().getDay()
  );
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(firstDayOfMonth);
  }, [firstDayOfMonth]);

  const eventTypes = [
    { label: 'Holiday', value: 'holiday', color: 'bg-red-100' },
    { label: 'Exam', value: 'exam', color: 'bg-blue-100' },
    { label: 'Event', value: 'event', color: 'bg-green-100' },
    { label: 'Deadline', value: 'deadline', color: 'bg-yellow-100' },
  ];

  const generateCalendar = () => {
    const year = currentMonth.getYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new NepaliDate(year, month, 1).getDay();
    const daysInMonth = new NepaliDate(year, month + 1, 0).getDate();

    const daysShift = Array.from({ length: firstDayOfMonth }).map(() => null);
    const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new NepaliDate(year, month, i + 1);
      const dateKey = date.format('YYYY-MM-DD');
      return {
        date,
        events: events[dateKey] || [],
        isCurrentMonth: true,
      };
    });

    return [...daysShift, ...calendarDays];
  };

  const handleMonthChange = (offset) => {
    // Get current date components
    const year = currentMonth.getYear();
    const currentMonthIndex = currentMonth.getMonth();

    // Calculate new month and handle year overflow
    const newMonthIndex = currentMonthIndex + offset;
    const newDate = new NepaliDate(year, newMonthIndex, 1);
    const firstDayOfMonth = new NepaliDate(year, newMonthIndex, 1).getDay();

    setCurrentMonth(newDate);
    setFirstDayOfMonth(firstDayOfMonth);
  };

  const handleAddEvent = (values) => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    setEvents((prev) => ({
      ...prev,
      [dateKey]: [
        ...(prev[dateKey] || []),
        { ...values, type: values.type || 'event' },
      ],
    }));
    setIsModalVisible(false);
  };

  const handleDeleteEvent = (dateKey, index) => {
    setEvents((prev) => {
      const updated = { ...prev };
      if (!updated[dateKey]) return updated;

      const newEvents = [...updated[dateKey]];
      newEvents.splice(index, 1);

      if (newEvents.length === 0) {
        delete updated[dateKey];
      } else {
        updated[dateKey] = newEvents;
      }
      return updated;
    });
  };

  const exportData = () => {
    const data = {
      academicYear: currentMonth.getYear(),
      events: Object.entries(events).flatMap(([date, events]) =>
        events.map((event) => ({ date, ...event }))
      ),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `academic-calendar-${currentMonth.getYear()}.json`;
    link.click();
  };

  const YearlyOverview = () => {
    const currentYear = currentMonth.getYear();

    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {currentYear} (B.S.) Academic Year Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }, (_, i) => {
            const monthDate = new NepaliDate(currentYear, i, 1);
            const monthEvents = Object.entries(events)
              .filter(([date]) => {
                const [y, m] = date.split('-').map(Number);
                return y === currentYear && m === i + 1;
              })
              .flatMap(([_, events]) => events);

            return (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">
                  {monthDate.format('MMMM')}
                </h4>
                {monthEvents.length > 0 ? (
                  <div className="space-y-2">
                    {monthEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className={`${
                          eventTypes.find((t) => t.value === event.type)?.color
                        } p-2 rounded text-sm`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No events scheduled</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const CalendarGrid = () => {
    const today = new NepaliDate();

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
        {['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिही', 'शुक्र', 'शनि'].map((day) => (
          <div
            key={day}
            className="bg-white p-2 text-center font-medium text-gray-600"
          >
            {day}
          </div>
        ))}

        {/* Render days of the month */}
        {generateCalendar().map((day, idx) => {
          if (!day) {
            // If it's an empty slot (before the first day of the month), render an empty cell
            return (
              <div
                key={idx}
                className="min-h-24 bg-white p-2 border-b border-r border-gray-100"
              ></div>
            );
          }

          const gregorianDate = day.date.toJsDate();
          const isToday =
            today.getYear() === day.date.getYear() &&
            today.getMonth() === day.date.getMonth() &&
            today.getDate() === day.date.getDate();

          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedDate(day.date);
                setIsModalVisible(true);
              }}
              className={`min-h-24 p-2 border-b border-r border-gray-100 hover:bg-gray-50 cursor-pointer ${
                isToday
                  ? 'bg-blue-400 border-4 border-blue-600 text-gray-100'
                  : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">
                  <div className={isToday ? 'text-gray-100' : 'text-gray-800'}>
                    {day.date.getDate()}
                  </div>
                  <div
                    className={`text-xs ${
                      isToday ? 'text-gray-100' : 'text-gray-400'
                    }`}
                  >
                    {dayjs(gregorianDate).format('D MMM')}
                  </div>
                </div>
                {day.events.length > 0 && (
                  <span className="text-xs text-gray-400">
                    {day.events.length} event(s)
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {day.events.map((event, i) => (
                  <Tooltip key={i} title={event.description}>
                    <div
                      className={`${
                        eventTypes.find((t) => t.value === event.type)?.color
                      } p-1 text-xs rounded truncate flex justify-between items-center`}
                    >
                      <span>{event.title}</span>
                      <DeleteOutlined
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(day.date.format('YYYY-MM-DD'), i);
                        }}
                        className="hover:text-red-600"
                      />
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => handleMonthChange(-1)}
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {currentMonth.format('MMMM YYYY')} (B.S.)
              <span className="block text-sm font-normal text-gray-500">
                {dayjs(currentMonth.toJsDate()).format('MMMM YYYY')} (A.D.)
              </span>
            </h2>
            <Button
              shape="circle"
              icon={<RightOutlined />}
              onClick={() => handleMonthChange(1)}
            />
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={exportData}
          >
            Export Academic Calendar
          </Button>
        </div>

        <CalendarGrid />
        <YearlyOverview />

        <Modal
          title={`Schedule Event - ${selectedDate?.format(
            'ddd, MMM D, YYYY'
          )} (B.S.)`}
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          destroyOnClose
        >
          <Form form={form} onFinish={handleAddEvent} layout="vertical">
            <Form.Item
              name="title"
              label="Event Title"
              rules={[{ required: true, message: 'Please enter event title' }]}
            >
              <Input placeholder="Midterm Exams" />
            </Form.Item>

            <Form.Item name="type" label="Event Type" initialValue="exam">
              <Select>
                {eventTypes.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Event Details"
              rules={[
                { required: true, message: 'Please enter event details' },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter event description, location, and other details"
              />
            </Form.Item>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Schedule Event
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AcademicCalendarEditor;
