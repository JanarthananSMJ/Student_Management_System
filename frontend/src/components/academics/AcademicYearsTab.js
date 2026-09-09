import React from 'react';
import ResourceCrudTab from './ResourceCrudTab';
import academicYearApi from '../../api/academicYearApi';
import Badge from '../ui/Badge';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'startDate', header: 'Start Date', render: (row) => (row.startDate ? row.startDate.substring(0, 10) : '-') },
  { key: 'endDate', header: 'End Date', render: (row) => (row.endDate ? row.endDate.substring(0, 10) : '-') },
  {
    key: 'isCurrent',
    header: 'Current',
    render: (row) => (row.isCurrent ? <Badge status="active">Current</Badge> : <Badge status="inactive">-</Badge>),
  },
];

const fields = [
  { name: 'name', label: 'Name' },
  { name: 'startDate', label: 'Start Date', type: 'date' },
  { name: 'endDate', label: 'End Date', type: 'date' },
  { name: 'isCurrent', label: 'Mark as current academic year', type: 'checkbox' },
];

const buildInitialState = (row) => ({
  name: row?.name || '',
  startDate: row?.startDate ? row.startDate.substring(0, 10) : '',
  endDate: row?.endDate ? row.endDate.substring(0, 10) : '',
  isCurrent: row?.isCurrent || false,
});

export default function AcademicYearsTab() {
  return (
    <ResourceCrudTab
      resourceLabel="Academic Year"
      api={academicYearApi}
      columns={columns}
      fields={fields}
      buildInitialState={buildInitialState}
    />
  );
}
