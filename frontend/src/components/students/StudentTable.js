import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function StudentTable({ students, loading, search, onSearch, filters, canEdit, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.user?.name || '-'}</p>
          <p className="text-xs text-gray-400">{row.user?.email}</p>
        </div>
      ),
    },
    { key: 'rollNumber', header: 'Roll No.' },
    { key: 'department', header: 'Department', render: (row) => row.department?.name || '-' },
    { key: 'course', header: 'Course', render: (row) => row.course?.name || '-' },
    { key: 'classSection', header: 'Section', render: (row) => row.classSection?.name || '-' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge status={row.status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            title="View"
            onClick={() => navigate(`/students/${row._id}`)}
          >
            <Eye className="h-4 w-4" />
          </button>
          {canEdit && (
            <>
              <button
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                title="Edit"
                onClick={() => navigate(`/students/${row._id}/edit`)}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                title="Delete"
                onClick={() => onDelete && onDelete(row)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={students}
      loading={loading}
      searchable
      searchValue={search}
      onSearch={onSearch}
      searchPlaceholder="Search students..."
      filters={filters}
      emptyMessage="No students found"
    />
  );
}

export function AddStudentButton({ onClick }) {
  return (
    <Button onClick={onClick}>
      Add Student
    </Button>
  );
}
