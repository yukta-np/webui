import { useState } from 'react';
import { Modal, Form, Input, Select, Button, Tooltip } from 'antd';
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const AcademicCalendarEditor = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'year'
  const [form] = Form.useForm();

  const eventTypes = [
    { label: 'Holiday', value: 'holiday', color: 'bg-red-100' },
    { label: 'Exam', value: 'exam', color: 'bg-blue-100' },
    { label: 'Event', value: 'event', color: 'bg-green-100' },
    { label: 'Deadline', value: 'deadline', color: 'bg-yellow-100' },
  ];

  const generateCalendar = () => {
    const startOfMonth = currentMonth.startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = startOfMonth.add(i, 'day');
      const dateKey = date.format('YYYY-MM-DD');
      return {
        date,
        events: events[dateKey] || [],
        isCurrentMonth: true,
      };
    });
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
      updated[dateKey].splice(index, 1);
      if (!updated[dateKey].length) delete updated[dateKey];
      return updated;
    });
  };

  const exportData = () => {
    const data = {
      academicYear: currentMonth.format('YYYY'),
      events: Object.entries(events).flatMap(([date, events]) =>
        events.map((event) => ({ date, ...event }))
      ),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `academic-calendar-${currentMonth.format('YYYY')}.json`;
    link.click();
  };

  const YearlyOverview = () => (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        {currentMonth.format('YYYY')} Academic Year Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }, (_, i) => {
          const month = currentMonth.month(i);
          const monthEvents = Object.entries(events)
            .filter(([date]) => dayjs(date).month() === i)
            .flatMap(([_, events]) => events);

          return (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">
                {month.format('MMMM')}
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

  const CalendarGrid = () => (
    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div
          key={day}
          className="bg-white p-2 text-center font-medium text-gray-600"
        >
          {day}
        </div>
      ))}
      {generateCalendar().map((day, idx) => (
        <div
          key={idx}
          onClick={() => {
            setSelectedDate(day.date);
            setIsModalVisible(true);
          }}
          className="min-h-24 bg-white p-2 border-b border-r border-gray-100 hover:bg-gray-50 cursor-pointer"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">
              {day.date.format('D')}
            </span>
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
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))}
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {currentMonth.format('MMMM YYYY')}
            </h2>
            <Button
              shape="circle"
              icon={<RightOutlined />}
              onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))}
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
          title={`Schedule Event - ${selectedDate?.format('ddd, MMM D, YYYY')}`}
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
