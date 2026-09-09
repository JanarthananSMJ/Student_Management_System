import React, { useEffect, useState } from 'react';
import ResourceCrudTab, { StatusBadgeCell } from './ResourceCrudTab';
import classSectionApi from '../../api/classSectionApi';
import courseApi from '../../api/courseApi';
import academicYearApi from '../../api/academicYearApi';
import staffApi from '../../api/staffApi';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'course', header: 'Course', render: (row) => row.course?.name || '-' },
  { key: 'academicYear', header: 'Academic Year', render: (row) => row.academicYear?.name || '-' },
  { key: 'section', header: 'Section' },
  { key: 'classTeacher', header: 'Class Teacher', render: (row) => row.classTeacher?.user?.name || '-' },
  { key: 'capacity', header: 'Capacity' },
  { key: 'status', header: 'Status', render: StatusBadgeCell },
];

export default function ClassSectionsTab() {
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    courseApi.list().then(setCourses).catch(() => setCourses([]));
    academicYearApi.list().then(setAcademicYears).catch(() => setAcademicYears([]));
    staffApi.list().then(setStaff).catch(() => setStaff([]));
  }, []);

  const fields = [
    { name: 'name', label: 'Name' },
    {
      name: 'course',
      label: 'Course',
      type: 'select',
      options: courses.map((c) => ({ value: c._id, label: c.name })),
    },
    {
      name: 'academicYear',
      label: 'Academic Year',
      type: 'select',
      options: academicYears.map((y) => ({ value: y._id, label: y.name })),
    },
    { name: 'section', label: 'Section' },
    {
      name: 'classTeacher',
      label: 'Class Teacher',
      type: 'select',
      options: staff.map((s) => ({ value: s._id, label: s.user?.name || s.staffId })),
    },
    { name: 'capacity', label: 'Capacity', type: 'number' },
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
    name: row?.name || '',
    course: row?.course?._id || row?.course || '',
    academicYear: row?.academicYear?._id || row?.academicYear || '',
    section: row?.section || '',
    classTeacher: row?.classTeacher?._id || row?.classTeacher || '',
    capacity: row?.capacity || '',
    status: row?.status || 'active',
  });

  return (
    <ResourceCrudTab
      resourceLabel="Class Section"
      api={classSectionApi}
      columns={columns}
      fields={fields}
      buildInitialState={buildInitialState}
    />
  );
}
