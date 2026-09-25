import React from 'react';
import ResourceCrudTab, { StatusBadgeCell } from './ResourceCrudTab';
import departmentApi from '../../api/departmentApi';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'code', header: 'Code' },
  { key: 'status', header: 'Status', render: StatusBadgeCell },
];

export default function DepartmentsTab() {
  const fields = [
    { name: 'name', label: 'Name' },
    { name: 'code', label: 'Code' },
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
