import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../ui/Toast';

// Generic admin CRUD tab shared by all the reference-data resources under
// Academics (departments, courses, subjects, class sections, academic years,
// semesters). Each concrete tab just supplies its columns/fields config.
export default function ResourceCrudTab({ resourceLabel, api, columns, fields, buildInitialState }) {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(buildInitialState());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .list()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(buildInitialState());
    setError('');
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(buildInitialState(row));
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete this ${resourceLabel.toLowerCase()}?`)) return;
    try {
      await api.remove(row._id);
      toast.success(`${resourceLabel} deleted`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // Optional reference selects (e.g. "Head of Department") submit '' when
      // left blank, which mongoose can't cast to ObjectId - omit them instead
      // of sending an empty string.
      const payload = { ...form };
      fields.forEach((f) => {
        if (f.type === 'select' && payload[f.name] === '') {
          delete payload[f.name];
        }
      });
      if (editing) {
        await api.update(editing._id, payload);
        toast.success(`${resourceLabel} updated`);
      } else {
        await api.create(payload);
        toast.success(`${resourceLabel} created`);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const tableColumns = isAdmin
    ? [
        ...columns,
        {
          key: 'actions',
          header: '',
          render: (row) => (
            <div className="flex items-center gap-1">
              <button
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                onClick={() => openEdit(row)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                onClick={() => handleDelete(row)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ),
        },
      ]
    : columns;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{resourceLabel}</h3>
        {isAdmin && (
          <Button icon={Plus} onClick={openCreate}>
            Add {resourceLabel}
          </Button>
        )}
      </div>

      <Table columns={tableColumns} data={items} loading={loading} emptyMessage={`No ${resourceLabel.toLowerCase()} found`} />

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${resourceLabel}` : `Add ${resourceLabel}`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {fields.map((f) => {
            if (f.type === 'select') {
              return (
                <Select
                  key={f.name}
                  label={f.label}
                  value={form[f.name] ?? ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  placeholder={`Select ${f.label.toLowerCase()}`}
                >
                  {f.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              );
            }
            if (f.type === 'checkbox') {
              return (
                <label key={f.name} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!form[f.name]}
                    onChange={(e) => setField(f.name, e.target.checked)}
                  />
                  {f.label}
                </label>
              );
            }
            return (
              <Input
                key={f.name}
                label={f.label}
                type={f.type || 'text'}
                value={form[f.name] ?? ''}
                onChange={(e) => setField(f.name, e.target.value)}
              />
            );
          })}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export function StatusBadgeCell(row) {
  return <Badge status={row.status} />;
}
