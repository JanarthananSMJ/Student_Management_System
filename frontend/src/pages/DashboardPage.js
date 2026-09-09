import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { GraduationCap, Users, Building2, BookOpen, Layers, ClipboardList } from 'lucide-react';
import dashboardApi from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value ?? '-'}</p>
        </div>
      </div>
    </Card>
  );
}

function AdminDashboard({ data }) {
  const chartData = (data.studentsByDepartment || []).map((d) => ({
    name: d.department,
    count: d.count,
  }));

  const columns = [
    { key: 'name', header: 'Name', render: (row) => row.user?.name || row.personalDetails?.firstName || '-' },
    { key: 'rollNumber', header: 'Roll No.' },
    { key: 'department', header: 'Department', render: (row) => row.department?.name || '-' },
    { key: 'status', header: 'Status', render: (row) => <Badge status={row.status} /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={GraduationCap} label="Total Students" value={data.totalStudents} />
        <StatCard icon={Users} label="Total Staff" value={data.totalStaff} />
        <StatCard icon={Building2} label="Departments" value={data.totalDepartments} />
        <StatCard icon={BookOpen} label="Courses" value={data.totalCourses} />
      </div>

      <Card>
        <CardHeader title="Students by Department" />
        <CardBody>
          {chartData.length === 0 ? (
            <p className="text-sm text-gray-400">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6938ea" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Recent Admissions" />
        <CardBody>
          <Table columns={columns} data={data.recentAdmissions || []} emptyMessage="No recent admissions" />
        </CardBody>
      </Card>
    </div>
  );
}

function StaffDashboard({ data }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={Layers} label="Assigned Classes" value={data.assignedClassesCount} />
        <StatCard icon={ClipboardList} label="Assigned Subjects" value={data.assignedSubjectsCount} />
      </div>

      <Card>
        <CardHeader title="Assigned Classes" />
        <CardBody>
          {(data.assignedClasses || []).length === 0 ? (
            <p className="text-sm text-gray-400">No classes assigned</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.assignedClasses.map((c, idx) => (
                <li key={c._id || idx} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
                  {c.name || JSON.stringify(c)}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Assigned Subjects" />
        <CardBody>
          {(data.assignedSubjects || []).length === 0 ? (
            <p className="text-sm text-gray-400">No subjects assigned</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.assignedSubjects.map((s, idx) => (
                <li key={s._id || idx} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
                  {s.name || JSON.stringify(s)}
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

function StudentDashboard({ data }) {
  const profile = data.profile || {};
  return (
    <Card>
      <CardHeader title="My Profile" subtitle="Overview of your academic record" />
      <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-400">Name</p>
          <p className="text-sm font-medium text-gray-900">{profile.user?.name || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Roll Number</p>
          <p className="text-sm font-medium text-gray-900">{profile.rollNumber || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Department</p>
          <p className="text-sm font-medium text-gray-900">{profile.department?.name || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Course</p>
          <p className="text-sm font-medium text-gray-900">{profile.course?.name || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Class Section</p>
          <p className="text-sm font-medium text-gray-900">{profile.classSection?.name || '-'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Status</p>
          <Badge status={profile.status} />
        </div>
      </CardBody>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardApi
      .get()
      .then(setData)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening in your college today.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : !data ? null : user?.role === 'admin' ? (
        <AdminDashboard data={data} />
      ) : user?.role === 'staff' ? (
        <StaffDashboard data={data} />
      ) : (
        <StudentDashboard data={data} />
      )}
    </div>
  );
}
