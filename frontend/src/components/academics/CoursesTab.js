import React, { useEffect, useState } from 'react';
import ResourceCrudTab, { StatusBadgeCell } from './ResourceCrudTab';
import courseApi from '../../api/courseApi';
import departmentApi from '../../api/departmentApi';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'code', header: 'Code' },
  { key: 'department', header: 'Department', render: (row) => row.department?.name || '-' },
  { key: 'durationSemesters', header: 'Duration (sem)' },
  { key: 'status', header: 'Status', render: StatusBadgeCell },
];

export default function CoursesTab() {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    departmentApi.list().then(setDepartments).catch(() => setDepartments([]));
  }, []);

  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'code', label: 'Code' },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      options: departments.map((d) => ({ value: d._id, label: d.name })),
    },
    { name: 'durationSemesters', label: 'Duration (Semesters)', type: 'number' },
    { name: 'description', label: 'Description' },
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
    department: row?.department?._id || row?.department || '',
    durationSemesters: row?.durationSemesters || '',
    description: row?.description || '',
    status: row?.status || 'active',
  });

  return (
    <ResourceCrudTab
      resourceLabel="Course"
      api={courseApi}
      columns={columns}
      fields={fields}
      buildInitialState={buildInitialState}
    />
  );
}
