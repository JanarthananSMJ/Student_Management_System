import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import staffApi from '../api/staffApi';
import StaffForm from '../components/staff/StaffForm';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../components/ui/Toast';

export default function StaffFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isEdit) {
      staffApi
        .get(id)
        .then(setInitialData)
        .catch(() => setServerError('Failed to load staff member'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setServerError('');
    try {
      if (isEdit) {
        await staffApi.update(id, form);
        toast.success('Staff member updated');
        navigate(`/staff/${id}`);
      } else {
        const created = await staffApi.create(form);
        toast.success('Staff member created');
        navigate(`/staff/${created._id}`);
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? 'Edit Staff' : 'Add Staff'}</h1>
          <p className="text-sm text-gray-500">
            {isEdit ? 'Update staff record details' : 'Create a new staff account and profile'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <StaffForm
          mode={isEdit ? 'edit' : 'create'}
          initialData={initialData}
          onSubmit={handleSubmit}
          submitting={submitting}
          serverError={serverError}
        />
      )}
    </div>
  );
}
