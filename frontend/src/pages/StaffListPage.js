import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import staffApi from '../api/staffApi';
import { useToast } from '../components/ui/Toast';
import StaffTable from '../components/staff/StaffTable';
import Button from '../components/ui/Button';

export default function StaffListPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    staffApi
      .list()
      .then(setStaff)
      .catch(() => setStaff([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    if (!search) return staff;
    const q = search.toLowerCase();
    return staff.filter(
      (s) =>
        s.user?.name?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q) ||
        s.staffId?.toLowerCase().includes(q)
    );
  }, [staff, search]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete staff member ${row.user?.name}?`)) return;
    try {
      await staffApi.remove(row._id);
      toast.success('Staff member deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff</h1>
          <p className="text-sm text-gray-500">Manage faculty and staff records.</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/staff/new')}>
          Add Staff
        </Button>
      </div>

      <StaffTable staff={filtered} loading={loading} search={search} onSearch={setSearch} onDelete={handleDelete} />
    </div>
  );
}
