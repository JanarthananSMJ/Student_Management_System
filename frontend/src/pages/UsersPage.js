import React, { useEffect, useMemo, useState } from 'react';
import { KeyRound } from 'lucide-react';
import userApi from '../api/userApi';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export default function UsersPage() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tempPassword, setTempPassword] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);

  const load = () => {
    setLoading(true);
    userApi
      .list()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, search]);

  const handleResetPassword = async (row) => {
    setResettingUser(row);
    try {
      const res = await userApi.resetPassword(row._id);
      setTempPassword(res.tempPassword);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
      setResettingUser(null);
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (row) => <Badge status={row.role} /> },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
    {
      key: 'mustChangePassword',
      header: 'Must Change Password',
      render: (row) => (row.mustChangePassword ? <Badge status="pending">Yes</Badge> : <span className="text-gray-400">No</span>),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          onClick={() => handleResetPassword(row)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-50"
        >
          <KeyRound className="h-3.5 w-3.5" />
          Reset Password
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500">Manage all login accounts across the system.</p>
      </div>

      <Table
        columns={columns}
        data={filtered}
        loading={loading}
        searchable
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Search users..."
        emptyMessage="No users found"
      />

      <Modal
        isOpen={!!tempPassword}
        onClose={() => {
          setTempPassword(null);
          setResettingUser(null);
        }}
        title="Temporary Password"
        footer={
          <Button
            onClick={() => {
              setTempPassword(null);
              setResettingUser(null);
            }}
          >
            Done
          </Button>
        }
      >
        <p className="mb-3 text-sm text-gray-600">
          A temporary password was generated for <strong>{resettingUser?.name}</strong>. Share it with them
          securely — it will not be shown again.
        </p>
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center font-mono text-lg font-semibold tracking-wider text-gray-900">
          {tempPassword}
        </div>
      </Modal>
    </div>
  );
}
