import React, { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import Button from '../ui/Button';
import { API_ORIGIN } from '../../api/axiosInstance';
import studentApi from '../../api/studentApi';

export default function DocumentUpload({ studentId, documents = [], onUploaded }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const updated = await studentApi.uploadDocument(studentId, file);
      onUploaded && onUploaded(updated);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <ul className="flex flex-col gap-2">
        {documents.length === 0 && <p className="text-sm text-gray-400">No documents uploaded yet.</p>}
        {documents.map((doc, idx) => (
          <li key={idx}>
            <a
              href={`${API_ORIGIN}${doc.url}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FileText className="h-4 w-4 text-primary-600" />
              {doc.name || `Document ${idx + 1}`}
            </a>
          </li>
        ))}
      </ul>
      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="secondary"
        icon={Upload}
        loading={uploading}
        onClick={() => fileRef.current && fileRef.current.click()}
      >
        Upload Document
      </Button>
    </div>
  );
}
