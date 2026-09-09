import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import staffApi from '../api/staffApi';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}

export default function StaffDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    staffApi
      .get(id)
      .then(setStaff)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load staff member'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error || !staff) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{staff.user?.name}</h1>
            <p className="text-sm text-gray-500">Staff ID {staff.staffId}</p>
          </div>
          <Badge status={staff.status} />
        </div>
        <Button icon={Pencil} variant="secondary" onClick={() => navigate(`/staff/${id}/edit`)}>
          Edit
        </Button>
      </div>

      <Card>
        <CardHeader title="Overview" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Email" value={staff.user?.email} />
          <Field label="Department" value={staff.department?.name} />
          <Field label="Designation" value={staff.designation} />
          <Field label="Phone" value={staff.phone} />
          <Field label="Joining Date" value={staff.joiningDate ? staff.joiningDate.substring(0, 10) : ''} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Address" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field
            label="Address"
            value={[
              staff.address?.line1,
              staff.address?.line2,
              staff.address?.city,
              staff.address?.state,
              staff.address?.pincode,
            ]
              .filter(Boolean)
              .join(', ')}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Assignments" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-gray-400">Subjects Handled</p>
            <div className="flex flex-wrap gap-2">
              {(staff.subjectsHandled || []).length === 0 && <p className="text-sm text-gray-400">None</p>}
              {(staff.subjectsHandled || []).map((s) => (
                <span key={s._id} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-gray-400">Classes Assigned</p>
            <div className="flex flex-wrap gap-2">
              {(staff.classesAssigned || []).length === 0 && <p className="text-sm text-gray-400">None</p>}
              {(staff.classesAssigned || []).map((c) => (
                <span key={c._id} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
