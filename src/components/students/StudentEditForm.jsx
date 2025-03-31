import React, { useEffect, useState } from 'react';
import StudentForm from '@/components/students/StudentForm';
import { getStudentById, updateStudent } from '@/services/students.http';
import { openNotification } from '@/utils';
import { Alert } from 'antd';
import moment from 'moment';

const StudentEditForm = ({ params }) => {
  const { id } = params;
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const { data } = await getStudentById(id);
        setInitialValues({
          ...data,
          dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth) : null,
          enrollmentDate: data.enrollmentDate
            ? moment(data.enrollmentDate)
            : null,
          graduationDate: data.graduationDate
            ? moment(data.graduationDate)
            : null,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadStudentData();
  }, [id]);

  const onSubmit = async (values) => {
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
    <StudentForm
      mode="edit"
      initialValues={initialValues}
      onFinish={onSubmit}
      loading={submitting}
      error={error}
    />
  );
};

export default StudentEditForm;
