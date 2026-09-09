import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import departmentApi from '../../api/departmentApi';
import subjectApi from '../../api/subjectApi';
import classSectionApi from '../../api/classSectionApi';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  staffId: '',
  department: '',
  designation: '',
  subjectsHandled: [],
  classesAssigned: [],
  phone: '',
  address: { line1: '', line2: '', city: '', state: '', pincode: '' },
  joiningDate: '',
};

export default function StaffForm({ mode = 'create', initialData, onSubmit, submitting, serverError }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classSections, setClassSections] = useState([]);

  useEffect(() => {
    departmentApi.list().then(setDepartments).catch(() => setDepartments([]));
    subjectApi.list().then(setSubjects).catch(() => setSubjects([]));
    classSectionApi.list().then(setClassSections).catch(() => setClassSections([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        name: initialData.user?.name || prev.name,
        email: initialData.user?.email || prev.email,
        staffId: initialData.staffId || '',
        department: initialData.department?._id || initialData.department || '',
        designation: initialData.designation || '',
        subjectsHandled: (initialData.subjectsHandled || []).map((s) => s._id || s),
        classesAssigned: (initialData.classesAssigned || []).map((c) => c._id || c),
        phone: initialData.phone || '',
        address: { ...prev.address, ...(initialData.address || {}) },
        joiningDate: initialData.joiningDate || '',
      }));
    }
  }, [initialData]);

  const setField = (path, value) => {
    setForm((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i += 1) {
        cur[keys[i]] = { ...cur[keys[i]] };
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const toggleMultiSelect = (field, id) => {
    setForm((prev) => {
      const set = new Set(prev[field]);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, [field]: Array.from(set) };
    });
  };

  const validate = () => {
    const next = {};
    if (mode === 'create') {
      if (!form.name) next.name = 'Required';
      if (!form.email) next.email = 'Required';
      if (!form.password) next.password = 'Required';
    }
    if (!form.staffId) next.staffId = 'Required';
    if (!form.department) next.department = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <Card>
        <CardHeader title="Account" subtitle="Login credentials for this staff member" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
            error={errors.name}
            disabled={mode === 'edit'}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setField('email', e.target.value)}
            error={errors.email}
            disabled={mode === 'edit'}
          />
          {mode === 'create' && (
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              error={errors.password}
            />
          )}
          <Input
            label="Staff ID"
            value={form.staffId}
            onChange={(e) => setField('staffId', e.target.value)}
            error={errors.staffId}
            disabled={mode === 'edit'}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Contact" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
          <Input
            label="Address Line 1"
            value={form.address.line1}
            onChange={(e) => setField('address.line1', e.target.value)}
          />
          <Input
            label="Address Line 2"
            value={form.address.line2}
            onChange={(e) => setField('address.line2', e.target.value)}
          />
          <Input
            label="City"
            value={form.address.city}
            onChange={(e) => setField('address.city', e.target.value)}
          />
          <Input
            label="State"
            value={form.address.state}
            onChange={(e) => setField('address.state', e.target.value)}
          />
          <Input
            label="Pincode"
            value={form.address.pincode}
            onChange={(e) => setField('address.pincode', e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Academic Assignment" />
        <CardBody className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Department"
              value={form.department}
              onChange={(e) => setField('department', e.target.value)}
              error={errors.department}
              placeholder="Select department"
              disabled={mode === 'edit'}
            >
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </Select>
            <Input
              label="Designation"
              value={form.designation}
              onChange={(e) => setField('designation', e.target.value)}
              disabled={mode === 'edit'}
            />
            <Input
              label="Joining Date"
              type="date"
              value={form.joiningDate ? form.joiningDate.substring(0, 10) : ''}
              onChange={(e) => setField('joiningDate', e.target.value)}
              disabled={mode === 'edit'}
            />
          </div>

          {mode === 'create' && (
            <>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Subjects Handled</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <label
                      key={s._id}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${
                        form.subjectsHandled.includes(s._id)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 text-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form.subjectsHandled.includes(s._id)}
                        onChange={() => toggleMultiSelect('subjectsHandled', s._id)}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">Classes Assigned</p>
                <div className="flex flex-wrap gap-2">
                  {classSections.map((c) => (
                    <label
                      key={c._id}
                      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium ${
                        form.classesAssigned.includes(c._id)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 text-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={form.classesAssigned.includes(c._id)}
                        onChange={() => toggleMultiSelect('classesAssigned', c._id)}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={submitting}>
          {mode === 'create' ? 'Create Staff' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
