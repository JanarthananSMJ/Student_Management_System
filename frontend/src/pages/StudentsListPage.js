import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import studentApi from '../api/studentApi';
import departmentApi from '../api/departmentApi';
import courseApi from '../api/courseApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import StudentTable from '../components/students/StudentTable';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

export default function StudentsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [status, setStatus] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    departmentApi.list().then(setDepartments).catch(() => setDepartments([]));
    courseApi.list().then(setCourses).catch(() => setCourses([]));
  }, []);

  const load = () => {
    setLoading(true);
    studentApi
      .list({ search: search || undefined, department: department || undefined, course: course || undefined, status: status || undefined })
      .then(setStudents)
      .catch(() => setStudents([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, course, status]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete student ${row.user?.name}?`)) return;
    try {
      await studentApi.remove(row._id);
      toast.success('Student deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filters = (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={department} onChange={(e) => setDepartment(e.target.value)} className="!py-1.5">
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name}
          </option>
        ))}
      </Select>
      <Select value={course} onChange={(e) => setCourse(e.target.value)} className="!py-1.5">
        <option value="">All Courses</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </Select>
      <Select value={status} onChange={(e) => setStatus(e.target.value)} className="!py-1.5">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="graduated">Graduated</option>
        <option value="suspended">Suspended</option>
      </Select>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500">Manage student records and enrollment.</p>
        </div>
        {isAdmin && (
          <Button icon={Plus} onClick={() => navigate('/students/new')}>
            Add Student
          </Button>
        )}
      </div>

      <StudentTable
        students={students}
        loading={loading}
        search={search}
        onSearch={setSearch}
        filters={filters}
        canEdit={isAdmin}
        onDelete={handleDelete}
      />
    </div>
  );
}
