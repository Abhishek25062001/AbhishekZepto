import { useEffect, useRef, useState } from 'react';

import type { PermissionCode } from '../../../../../../packages/shared/api';
import { Button, Loader } from '../../../components/common';
import { CanAccess } from '../../../components/auth/CanAccess';
import { deleteVendorMediaFile, listVendorMediaFiles, uploadVendorMedia } from '../api/vendor-media.api';
import type { VendorMediaFile } from '../types/vendor-media.types';

export function VendorMediaListPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<VendorMediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await listVendorMediaFiles();
      setFiles(items);
    } catch {
      setError('Unable to load media files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFiles();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      await uploadVendorMedia(file, { filePurpose: 'product_image', isPublic: true });
      await loadFiles();
    } catch {
      setError('Upload failed. Check media:upload permission and file type.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (mediaFileId: string) => {
    setError(null);
    try {
      await deleteVendorMediaFile(mediaFileId);
      await loadFiles();
    } catch {
      setError('Delete failed.');
    }
  };

  if (loading) {
    return <Loader label="Loading media…" mode="page" />;
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
        <div>
          <h1 style={{ margin: 0 }}>Media library</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Upload and manage vendor media assets.</p>
        </div>
        <CanAccess permission={'media:upload' as PermissionCode}>
          <Button
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            {uploading ? 'Uploading…' : 'Upload image'}
          </Button>
        </CanAccess>
      </header>
      <input
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleUpload(file);
          }
          event.target.value = '';
        }}
        ref={fileInputRef}
        type="file"
      />
      {error ? <p style={{ color: 'var(--color-danger)' }}>{error}</p> : null}
      <Button onClick={() => void loadFiles()} type="button" variant="ghost">
        Refresh
      </Button>
      {files.length === 0 ? (
        <p>No media files yet.</p>
      ) : (
        <ul style={{ display: 'grid', gap: 'var(--spacing-md)', listStyle: 'none', padding: 0 }}>
          {files.map((file) => (
            <li
              key={file.id}
              style={{
                alignItems: 'center',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
              }}
            >
              {file.publicUrl ? (
                <img alt={file.originalFileName} src={file.publicUrl} style={{ height: 64, width: 64 }} />
              ) : null}
              <div style={{ flex: 1 }}>
                <strong>{file.originalFileName}</strong>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{file.mimeType}</p>
              </div>
              <CanAccess permission={'media:delete' as PermissionCode}>
                <Button onClick={() => void handleDelete(file.id)} type="button" variant="ghost">
                  Delete
                </Button>
              </CanAccess>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
