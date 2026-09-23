import React, { useEffect, useState } from 'react';
import ResourceCrudTab, { StatusBadgeCell } from './ResourceCrudTab';
import departmentApi from '../../api/departmentApi';
import staffApi from '../../api/staffApi';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'code', header: 'Code' },
  { key: 'hod', header: 'HOD', render: (row) => row.hod?.user?.name || row.hod?.staffId || '-' },
  { key: 'status', header: 'Status', render: StatusBadgeCell },
];

export default function DepartmentsTab() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    staffApi.list().then(setStaff).catch(() => setStaff([]));
  }, []);

  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'code', label: 'Code' },
    {
      name: 'hod',
      label: 'Head of Department',
      type: 'select',
      options: staff.map((s) => ({ value: s._id, label: s.user?.name || s.staffId })),
    },
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
    hod: row?.hod?._id || row?.hod || '',
    description: row?.description || '',
    status: row?.status || 'active',
  });

  return (
    <ResourceCrudTab
      resourceLabel="Department"
      api={departmentApi}
      columns={columns}
      fields={fields}
      buildInitialState={buildInitialState}
    />
  );
}
