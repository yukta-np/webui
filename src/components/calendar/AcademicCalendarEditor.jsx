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

  const eventTypes = [
    { label: 'Holiday', value: 'holiday', color: 'bg-red-300' },
    { label: 'Exam', value: 'exam', color: 'bg-blue-300' },
    { label: 'Event', value: 'event', color: 'bg-green-300' },
    { label: 'Deadline', value: 'deadline', color: 'bg-yellow-300' },
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

    const totalCells = 7 * 6; // 7 days * 6 rows(max. weeks) = 42 cells
    const emptyCellsAtEnd = Array.from({
      length: totalCells - (daysShift.length + calendarDays.length),
    }).map(() => null);

    return [...daysShift, ...calendarDays, ...emptyCellsAtEnd];
  };

  const onMonthChange = (offset) => {
    // Get current date components
    const year = currentMonth.getYear();
    const currentMonthIndex = currentMonth.getMonth();

    // Calculate new month and on year overflow
    const newMonthIndex = currentMonthIndex + offset;
    const newDate = new NepaliDate(year, newMonthIndex, 1);
    const firstDayOfMonth = new NepaliDate(year, newMonthIndex, 1).getDay();

    setCurrentMonth(newDate);
    setFirstDayOfMonth(firstDayOfMonth);
  };

  const onAddEvent = (values) => {
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

  const onDeleteEvent = (dateKey, index) => {
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
      <div className="p-6 mt-8 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          {currentYear} (B.S.) Academic Year Overview
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }, (_, i) => {
            const monthDate = new NepaliDate(currentYear, i, 1);
            const monthEvents = Object.entries(events)
              .filter(([date]) => {
                const [y, m] = date.split('-').map(Number);
                return y === currentYear && m === i + 1;
              })
              .flatMap(([_, events]) => events);

            return (
              <div key={i} className="p-4 rounded-lg bg-gray-50">
                <h4 className="mb-2 font-medium text-gray-700">
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
                  <p className="text-sm text-gray-400">No events scheduled</p>
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
      <div className=" grid grid-cols-7  gap-px bg-gray-300">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-3 pb-6 text-xl font-semibold text-center text-gray-600 bg-white"
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
                className="p-2 bg-white border-b border-r border-gray-100 min-h-24"
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
              className={`min-h-24 p-2 border-b border-r border-gray-100 cursor-pointer ${
                isToday ? 'bg-blue-600  text-gray-100' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-lg font-semibold">
                  <div className={isToday ? 'text-gray-100' : 'text-gray-800'}>
                    {day.date.getDate()}
                  </div>
                  <div
                    className={`text-xs ${
                      isToday ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    {dayjs(gregorianDate).format('D MMM')}
                  </div>
                </div>
                {day.events.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {day.events.length}{' '}
                    {day.events.length > 1 ? 'events' : 'event'}
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
                          onDeleteEvent(day.date.format('YYYY-MM-DD'), i);
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

  const UpcomingEvents = () => {
    return (
      <div className="p-4 rounded-lg bg-gray-50">
        <h4 className="mb-2 text-lg font-medium text-gray-700">
          Upcoming Events
        </h4>
        {events.length > 0 ? (
          <div className="space-y-2">
            {/* TODO: map the upcoming events here, please... */}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No upcoming events</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => onMonthChange(-1)}
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
              onClick={() => onMonthChange(1)}
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

        <section className="grid grid-cols-[75%_1fr] gap-12">
          <CalendarGrid />
          <aside className="border-l-2 border-gray-300">
            <UpcomingEvents />
          </aside>
        </section>

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
          <Form form={form} onFinish={onAddEvent} layout="vertical">
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
