import React from 'react';
import ResourceCrudTab, { StatusBadgeCell } from './ResourceCrudTab';
import departmentApi from '../../api/departmentApi';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'code', header: 'Code' },
  { key: 'hod', header: 'HOD' },
  { key: 'status', header: 'Status', render: StatusBadgeCell },
];

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'code', label: 'Code' },
  { name: 'hod', label: 'Head of Department' },
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
  hod: row?.hod || '',
  description: row?.description || '',
  status: row?.status || 'active',
});

export default function DepartmentsTab() {
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
