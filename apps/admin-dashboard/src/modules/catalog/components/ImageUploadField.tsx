import { useCallback } from 'react';

import { Button, Input } from '../../../components/common';
import { useAuthStore } from '../../../store/auth.store';
import type { MediaFilePurpose } from '../constants/media-purpose.constants';
import { useMediaUpload } from '../hooks/useMediaUpload';
import { canUploadMedia } from '../utils/catalog-permissions.util';

type ImageUploadFieldProps = {
  disabled?: boolean;
  filePurpose: MediaFilePurpose;
  helpText?: string;
  label?: string;
  ownerId?: string;
  ownerType?: string;
  previewUrl?: string | null;
  required?: boolean;
  value?: string | null;
  onChange: (next: { mediaFileId?: string; previewUrl?: string | null }) => void;
};

export function ImageUploadField({
  disabled = false,
  filePurpose,
  helpText,
  label = 'Image',
  ownerId,
  ownerType,
  previewUrl,
  required = false,
  value,
  onChange,
}: ImageUploadFieldProps) {
  const permissions = useAuthStore((state) => state.permissions);
  const uploadAllowed = canUploadMedia(permissions);
  const upload = useMediaUpload();

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !uploadAllowed) {
        return;
      }
      const result = await upload.mutateAsync({
        file,
        payload: {
          filePurpose,
          ownerId,
          ownerType,
          isPublic: true,
        },
      });
      onChange({ mediaFileId: result.mediaFileId, previewUrl: result.publicUrl ?? undefined });
    },
    [filePurpose, onChange, ownerId, ownerType, upload, uploadAllowed],
  );

  const busy = upload.isPending;
  const isDisabled = disabled || busy || !uploadAllowed;

  return (
    <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
      <div style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-md)' }}>
        <label htmlFor={`image-upload-${filePurpose}`} style={{ fontWeight: 600 }}>
          {label}
          {required ? ' *' : ''}
        </label>
        <input
          accept="image/*"
          disabled={isDisabled}
          id={`image-upload-${filePurpose}`}
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            void handleFile(file);
            event.target.value = '';
          }}
        />
      </div>
      {value ? (
        <Input
          label="Media file ID"
          readOnly
          value={value}
        />
      ) : null}
      {previewUrl ? (
        <img
          alt=""
          src={previewUrl}
          style={{ borderRadius: 'var(--radius-md)', maxHeight: 160, maxWidth: '100%' }}
        />
      ) : null}
      {!uploadAllowed ? (
        <p style={{ color: 'var(--color-warning)', margin: 0 }}>You do not have permission to upload media.</p>
      ) : null}
      {helpText ? <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>{helpText}</p> : null}
      {value ? (
        <Button type="button" variant="ghost" onClick={() => onChange({ mediaFileId: undefined, previewUrl: null })}>
          Clear image
        </Button>
      ) : null}
    </div>
  );
}
