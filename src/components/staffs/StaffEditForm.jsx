import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // If using Next.js app router
import StaffForm from '@/components/staff/StaffForm';
import { getStaffById, updateStaff } from '@/services/staff.http';
import { openNotification } from '@/utils';
import { Alert, Card, Typography } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

const StaffEditForm = () => {
  const router = useRouter();
  const { query } = router;
  const { id } = query;
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadStaffData = async () => {
      try {
        const staffData = await getStaffById(id);

        if (!staffData) {
          setError('Staff member not found');
          return;
        }

        setInitialValues({
          ...staffData,
          dateOfBirth: staffData.dateOfBirth
            ? moment(staffData.dateOfBirth)
            : null,
          hireDate: staffData.hireDate ? moment(staffData.hireDate) : null,
          terminationDate: staffData.terminationDate
            ? moment(staffData.terminationDate)
            : null,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load staff data');
        openNotification('Error loading staff data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id) loadStaffData();
  }, [id]);

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        hireDate: values.hireDate?.format('YYYY-MM-DD'),
        terminationDate: values.terminationDate?.format('YYYY-MM-DD'),
      };

      await updateStaff(id, payload);
      openNotification('Staff member updated successfully!');
      setError(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Error updating staff member';
      openNotification(errorMessage, 'error');
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading staff data...</p>;
  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <StaffForm
      mode="edit"
      initialValues={initialValues}
      onFinish={onSubmit}
      loading={submitting}
      error={error}
    />
  );
};

export default StaffEditForm;
