import StudentProfile from '@/components/userprofile/StudentProfile'
import React from 'react'

const StudentProfilePage = ({ query }) => {
  const { id } = query

  return (
    <StudentProfile id={id} />
  )
}

export default StudentProfilePage
