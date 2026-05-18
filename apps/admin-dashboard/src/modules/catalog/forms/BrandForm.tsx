import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { MEDIA_FILE_PURPOSE } from '../constants/media-purpose.constants';
import { ImageUploadField } from '../components/ImageUploadField';
import { brandFormSchema, type BrandFormInput, type BrandFormSchemaValues } from './brand-form.schema';

export { brandFormSchema } from './brand-form.schema';
export type { BrandFormInput, BrandFormSchemaValues } from './brand-form.schema';

type BrandFormProps = {
  defaultValues?: Partial<BrandFormInput>;
  submitLabel?: string;
  onSubmit: (values: BrandFormSchemaValues) => Promise<void> | void;
};

export function BrandForm({ defaultValues, submitLabel = 'Save brand', onSubmit }: BrandFormProps) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<
    BrandFormInput,
    unknown,
    BrandFormSchemaValues
  >({
    defaultValues: {
      bannerUrl: '',
      description: '',
      isFeatured: false,
      isVisible: true,
      logoUrl: '',
      name: '',
      status: CATALOG_STATUS.ACTIVE,
      ...defaultValues,
    },
    resolver: zodResolver(brandFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 720 }}
      onSubmit={handleSubmit(async (values) => onSubmit(values))}
    >
      <Input error={formState.errors.name?.message} label="Name" {...register('name')} />
      <Input error={formState.errors.description?.message} label="Description" {...register('description')} />
      <ImageUploadField
        filePurpose={MEDIA_FILE_PURPOSE.BRAND_LOGO}
        label="Logo"
        previewUrl={watch('logoUrl')}
        value={watch('logoMediaFileId')}
        onChange={({ mediaFileId, previewUrl }) => {
          setValue('logoMediaFileId', mediaFileId ?? undefined, { shouldValidate: true });
          setValue('logoUrl', previewUrl ?? '', { shouldValidate: true });
        }}
      />
      <ImageUploadField
        filePurpose={MEDIA_FILE_PURPOSE.BRAND_BANNER}
        label="Banner"
        previewUrl={watch('bannerUrl')}
        value={watch('bannerMediaFileId')}
        onChange={({ mediaFileId, previewUrl }) => {
          setValue('bannerMediaFileId', mediaFileId ?? undefined, { shouldValidate: true });
          setValue('bannerUrl', previewUrl ?? '', { shouldValidate: true });
        }}
      />
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isFeatured')} />
        Featured
      </label>
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isVisible')} />
        Visible
      </label>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="brand-status">Status</label>
        <select
          id="brand-status"
          {...register('status')}
          style={{
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
          }}
        >
          <option value={CATALOG_STATUS.ACTIVE}>Active</option>
          <option value={CATALOG_STATUS.INACTIVE}>Inactive</option>
          <option value={CATALOG_STATUS.ARCHIVED}>Archived</option>
        </select>
      </div>
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
