import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import departmentApi from '../../api/departmentApi';
import courseApi from '../../api/courseApi';
import classSectionApi from '../../api/classSectionApi';
import academicYearApi from '../../api/academicYearApi';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  rollNumber: '',
  personalDetails: { firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '' },
  contact: {
    email: '',
    phone: '',
    address: { line1: '', line2: '', city: '', state: '', pincode: '' },
  },
  guardian: { name: '', relation: '', phone: '', email: '', occupation: '' },
  department: '',
  course: '',
  classSection: '',
  admission: { admissionNumber: '', admissionDate: '', academicYear: '' },
};

function mergeDeep(base, incoming) {
  if (!incoming) return base;
  const out = { ...base };
  Object.keys(base).forEach((key) => {
    if (typeof base[key] === 'object' && base[key] !== null && !Array.isArray(base[key])) {
      out[key] = mergeDeep(base[key], incoming[key]);
    } else if (incoming[key] !== undefined && incoming[key] !== null) {
      out[key] = incoming[key];
    }
  });
  return out;
}

export default function StudentForm({ mode = 'create', initialData, onSubmit, submitting, serverError }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classSections, setClassSections] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  useEffect(() => {
    departmentApi.list().then(setDepartments).catch(() => setDepartments([]));
    courseApi.list().then(setCourses).catch(() => setCourses([]));
    classSectionApi.list().then(setClassSections).catch(() => setClassSections([]));
    academicYearApi.list().then(setAcademicYears).catch(() => setAcademicYears([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm((prev) =>
        mergeDeep(prev, {
          ...initialData,
          name: initialData.user?.name,
          email: initialData.user?.email,
          department: initialData.department?._id || initialData.department,
          course: initialData.course?._id || initialData.course,
          classSection: initialData.classSection?._id || initialData.classSection,
          admission: {
            ...initialData.admission,
            academicYear:
              initialData.admission?.academicYear?._id || initialData.admission?.academicYear,
          },
        })
      );
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

  const validate = () => {
    const next = {};
    if (mode === 'create') {
      if (!form.name) next.name = 'Required';
      if (!form.email) next.email = 'Required';
      if (!form.password) next.password = 'Required';
    }
    if (!form.rollNumber) next.rollNumber = 'Required';
    if (!form.department) next.department = 'Required';
    if (!form.course) next.course = 'Required';
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
        <CardHeader title="Account" subtitle="Login credentials for this student" />
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
            label="Roll Number"
            value={form.rollNumber}
            onChange={(e) => setField('rollNumber', e.target.value)}
            error={errors.rollNumber}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Personal Details" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="First Name"
            value={form.personalDetails.firstName}
            onChange={(e) => setField('personalDetails.firstName', e.target.value)}
          />
          <Input
            label="Last Name"
            value={form.personalDetails.lastName}
            onChange={(e) => setField('personalDetails.lastName', e.target.value)}
          />
          <Input
            label="Date of Birth"
            type="date"
            value={form.personalDetails.dob ? form.personalDetails.dob.substring(0, 10) : ''}
            onChange={(e) => setField('personalDetails.dob', e.target.value)}
          />
          <Select
            label="Gender"
            value={form.personalDetails.gender}
            onChange={(e) => setField('personalDetails.gender', e.target.value)}
            placeholder="Select gender"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
          <Input
            label="Blood Group"
            value={form.personalDetails.bloodGroup}
            onChange={(e) => setField('personalDetails.bloodGroup', e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Contact" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Contact Email"
            type="email"
            value={form.contact.email}
            onChange={(e) => setField('contact.email', e.target.value)}
          />
          <Input
            label="Phone"
            value={form.contact.phone}
            onChange={(e) => setField('contact.phone', e.target.value)}
          />
          <Input
            label="Address Line 1"
            value={form.contact.address.line1}
            onChange={(e) => setField('contact.address.line1', e.target.value)}
          />
          <Input
            label="Address Line 2"
            value={form.contact.address.line2}
            onChange={(e) => setField('contact.address.line2', e.target.value)}
          />
          <Input
            label="City"
            value={form.contact.address.city}
            onChange={(e) => setField('contact.address.city', e.target.value)}
          />
          <Input
            label="State"
            value={form.contact.address.state}
            onChange={(e) => setField('contact.address.state', e.target.value)}
          />
          <Input
            label="Pincode"
            value={form.contact.address.pincode}
            onChange={(e) => setField('contact.address.pincode', e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Guardian" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Guardian Name"
            value={form.guardian.name}
            onChange={(e) => setField('guardian.name', e.target.value)}
          />
          <Input
            label="Relation"
            value={form.guardian.relation}
            onChange={(e) => setField('guardian.relation', e.target.value)}
          />
          <Input
            label="Phone"
            value={form.guardian.phone}
            onChange={(e) => setField('guardian.phone', e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={form.guardian.email}
            onChange={(e) => setField('guardian.email', e.target.value)}
          />
          <Input
            label="Occupation"
            value={form.guardian.occupation}
            onChange={(e) => setField('guardian.occupation', e.target.value)}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Academic Assignment" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label="Department"
            value={form.department}
            onChange={(e) => setField('department', e.target.value)}
            error={errors.department}
            placeholder="Select department"
          >
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </Select>
          <Select
            label="Course"
            value={form.course}
            onChange={(e) => setField('course', e.target.value)}
            error={errors.course}
            placeholder="Select course"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select
            label="Class Section"
            value={form.classSection}
            onChange={(e) => setField('classSection', e.target.value)}
            placeholder="Select class section"
          >
            {classSections.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Input
            label="Admission Number"
            value={form.admission.admissionNumber}
            onChange={(e) => setField('admission.admissionNumber', e.target.value)}
          />
          <Input
            label="Admission Date"
            type="date"
            value={form.admission.admissionDate ? form.admission.admissionDate.substring(0, 10) : ''}
            onChange={(e) => setField('admission.admissionDate', e.target.value)}
          />
          <Select
            label="Academic Year"
            value={form.admission.academicYear}
            onChange={(e) => setField('admission.academicYear', e.target.value)}
            placeholder="Select academic year"
          >
            {academicYears.map((y) => (
              <option key={y._id} value={y._id}>
                {y.name}
              </option>
            ))}
          </Select>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" loading={submitting}>
          {mode === 'create' ? 'Create Student' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
