import React, { useEffect, useState } from 'react';
import ResourceCrudTab, { StatusBadgeCell } from './ResourceCrudTab';
import subjectApi from '../../api/subjectApi';
import courseApi from '../../api/courseApi';
import semesterApi from '../../api/semesterApi';
import staffApi from '../../api/staffApi';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'code', header: 'Code' },
  { key: 'course', header: 'Course', render: (row) => row.course?.name || '-' },
  { key: 'semester', header: 'Semester', render: (row) => row.semester?.number ?? row.semester ?? '-' },
  { key: 'credits', header: 'Credits' },
  { key: 'teacher', header: 'Teacher', render: (row) => row.teacher?.user?.name || row.teacher?.staffId || '-' },
  { key: 'status', header: 'Status', render: StatusBadgeCell },
];

export default function SubjectsTab() {
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    courseApi.list().then(setCourses).catch(() => setCourses([]));
    semesterApi.list().then(setSemesters).catch(() => setSemesters([]));
    staffApi.list().then(setStaff).catch(() => setStaff([]));
  }, []);

  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'code', label: 'Code' },
    {
      name: 'course',
      label: 'Course',
      type: 'select',
      options: courses.map((c) => ({ value: c._id, label: c.name })),
    },
    {
      name: 'semester',
      label: 'Semester',
      type: 'select',
      options: semesters.map((s) => ({ value: s._id, label: `Semester ${s.number}` })),
    },
    { name: 'credits', label: 'Credits', type: 'number' },
    {
      name: 'teacher',
      label: 'Teacher',
      type: 'select',
      options: staff.map((s) => ({ value: s._id, label: s.user?.name || s.staffId })),
    },
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
    code: row?.code || '',
    course: row?.course?._id || row?.course || '',
    semester: row?.semester?._id || row?.semester || '',
    credits: row?.credits || '',
    teacher: row?.teacher?._id || row?.teacher || '',
    status: row?.status || 'active',
  });

  return (
    <ResourceCrudTab
      resourceLabel="Subject"
      api={subjectApi}
      columns={columns}
      fields={fields}
      buildInitialState={buildInitialState}
    />
  );
}
