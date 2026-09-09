import React, { useEffect, useState } from 'react';
import { KeyRound } from 'lucide-react';
import authApi from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { useToast } from '../components/ui/Toast';

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || '-'}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    authApi
      .me()
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match');
      return;
    }
    setChanging(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  const profile = me?.profile;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">View your account details and manage your password.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader title="Account" />
            <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Name" value={me?.name || user?.name} />
              <Field label="Email" value={me?.email || user?.email} />
              <div>
                <p className="text-xs text-gray-400">Role</p>
                <Badge status={me?.role || user?.role} />
              </div>
            </CardBody>
          </Card>

          {profile && (
            <Card>
              <CardHeader title="Profile Details" />
              <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Roll Number / Staff ID" value={profile.rollNumber || profile.staffId} />
                <Field label="Department" value={profile.department?.name} />
                <Field label="Course" value={profile.course?.name} />
                <Field label="Class Section" value={profile.classSection?.name} />
                <Field label="Designation" value={profile.designation} />
                <Field label="Phone" value={profile.contact?.phone || profile.phone} />
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader title="Change Password" subtitle="Use a strong password you don't use elsewhere" />
            <CardBody>
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
                {pwError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {pwError}
                  </div>
                )}
                <Input
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button type="submit" icon={KeyRound} loading={changing} className="self-start">
                  Update Password
                </Button>
              </form>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
