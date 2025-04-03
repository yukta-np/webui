import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // If using Next.js app router
import StudentForm from '@/components/students/StudentForm';
import { getStudentById, updateStudent } from '@/services/students.http';
import { openNotification } from '@/utils';
import { Alert, Card, Typography } from 'antd';
import moment from 'moment';

const { Title, Text } = Typography; // Fixed missing import

const StudentEditForm = () => {
  const { id } = useParams(); // Use `useParams()` to get `id`
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const studentData = await getStudentById(id);

        if (!studentData) {
          setError('Student not found');
          return;
        }

        setInitialValues({
          ...studentData,
          dateOfBirth: studentData.dateOfBirth
            ? moment(studentData.dateOfBirth)
            : null,
          enrollmentDate: studentData.enrollmentDate
            ? moment(studentData.enrollmentDate)
            : null,
          graduationDate: studentData.graduationDate
            ? moment(studentData.graduationDate)
            : null,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load student data');
        openNotification('Error loading student data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadStudentData();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        enrollmentDate: values.enrollmentDate?.format('YYYY-MM-DD'),
        graduationDate: values.graduationDate?.format('YYYY-MM-DD'),
      };

      await updateStudent(id, payload);
      openNotification('Student updated successfully!');
      setError(null); // Clear previous errors on success
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Error updating student';
      openNotification(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading student data...</p>;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className='mb-4 '>
      <Card className="shadow-sm">
        <StudentForm
          mode="edit"
          initialValues={initialValues}
          onFinish={handleSubmit}
          loading={submitting}
          error={error}
        />
      </Card>
    </div>
  );
};

export default StudentEditForm;
