import React, { useEffect, useState } from 'react';
import ResourceCrudTab, { StatusBadgeCell } from './ResourceCrudTab';
import semesterApi from '../../api/semesterApi';
import academicYearApi from '../../api/academicYearApi';
import courseApi from '../../api/courseApi';

const columns = [
  { key: 'number', header: 'Number' },
  { key: 'academicYear', header: 'Academic Year', render: (row) => row.academicYear?.name || '-' },
  { key: 'course', header: 'Course', render: (row) => row.course?.name || '-' },
  { key: 'startDate', header: 'Start Date', render: (row) => (row.startDate ? row.startDate.substring(0, 10) : '-') },
  { key: 'endDate', header: 'End Date', render: (row) => (row.endDate ? row.endDate.substring(0, 10) : '-') },
  { key: 'status', header: 'Status', render: StatusBadgeCell },
];

export default function SemestersTab() {
  const [academicYears, setAcademicYears] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    academicYearApi.list().then(setAcademicYears).catch(() => setAcademicYears([]));
    courseApi.list().then(setCourses).catch(() => setCourses([]));
  }, []);

  const fields = [
    { name: 'number', label: 'Semester Number', type: 'number' },
    {
      name: 'academicYear',
      label: 'Academic Year',
      type: 'select',
      options: academicYears.map((y) => ({ value: y._id, label: y.name })),
    },
    {
      name: 'course',
      label: 'Course',
      type: 'select',
      options: courses.map((c) => ({ value: c._id, label: c.name })),
    },
    { name: 'startDate', label: 'Start Date', type: 'date' },
    { name: 'endDate', label: 'End Date', type: 'date' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ];

  const buildInitialState = (row) => ({
    number: row?.number || '',
    academicYear: row?.academicYear?._id || row?.academicYear || '',
    course: row?.course?._id || row?.course || '',
    startDate: row?.startDate ? row.startDate.substring(0, 10) : '',
    endDate: row?.endDate ? row.endDate.substring(0, 10) : '',
    status: row?.status || 'active',
  });

  return (
    <ResourceCrudTab
      resourceLabel="Semester"
      api={semesterApi}
      columns={columns}
      fields={fields}
      buildInitialState={buildInitialState}
    />
  );
}
