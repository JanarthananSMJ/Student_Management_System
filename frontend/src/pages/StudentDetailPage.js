import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import studentApi from '../api/studentApi';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import DocumentUpload from '../components/students/DocumentUpload';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    studentApi
      .get(id)
      .then(setStudent)
      .catch((err) => setError(err.response?.data?.message || 'Failed to load student'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error || !student) {
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
            <h1 className="text-2xl font-semibold text-gray-900">{student.user?.name}</h1>
            <p className="text-sm text-gray-500">Roll No. {student.rollNumber}</p>
          </div>
          <Badge status={student.status} />
        </div>
        {isAdmin && (
          <Button icon={Pencil} variant="secondary" onClick={() => navigate(`/students/${id}/edit`)}>
            Edit
          </Button>
        )}
      </div>

      <Card>
        <CardHeader title="Personal Details" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="First Name" value={student.personalDetails?.firstName} />
          <Field label="Last Name" value={student.personalDetails?.lastName} />
          <Field
            label="Date of Birth"
            value={student.personalDetails?.dob ? student.personalDetails.dob.substring(0, 10) : ''}
          />
          <Field label="Gender" value={student.personalDetails?.gender} />
          <Field label="Blood Group" value={student.personalDetails?.bloodGroup} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Contact" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Email" value={student.contact?.email} />
          <Field label="Phone" value={student.contact?.phone} />
          <Field
            label="Address"
            value={[
              student.contact?.address?.line1,
              student.contact?.address?.line2,
              student.contact?.address?.city,
              student.contact?.address?.state,
              student.contact?.address?.pincode,
            ]
              .filter(Boolean)
              .join(', ')}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Guardian" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Name" value={student.guardian?.name} />
          <Field label="Relation" value={student.guardian?.relation} />
          <Field label="Phone" value={student.guardian?.phone} />
          <Field label="Email" value={student.guardian?.email} />
          <Field label="Occupation" value={student.guardian?.occupation} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Academic" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Department" value={student.department?.name} />
          <Field label="Course" value={student.course?.name} />
          <Field label="Class Section" value={student.classSection?.name} />
          <Field label="Admission Number" value={student.admission?.admissionNumber} />
          <Field
            label="Admission Date"
            value={student.admission?.admissionDate ? student.admission.admissionDate.substring(0, 10) : ''}
          />
          <Field label="Academic Year" value={student.admission?.academicYear?.name} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Documents" subtitle="Uploaded certificates and identity proofs" />
        <CardBody>
          <DocumentUpload studentId={id} documents={student.documents} onUploaded={setStudent} />
        </CardBody>
      </Card>
    </div>
  );
}
