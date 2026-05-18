import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { MEDIA_FILE_PURPOSE } from '../constants/media-purpose.constants';
import { CategorySelect } from '../components/CategorySelect';
import { ImageUploadField } from '../components/ImageUploadField';
import { categoryFormSchema, type CategoryFormInput, type CategoryFormSchemaValues } from './category-form.schema';

export { categoryFormSchema } from './category-form.schema';
export type { CategoryFormInput, CategoryFormSchemaValues } from './category-form.schema';

type CategoryFormProps = {
  defaultValues?: Partial<CategoryFormInput>;
  excludeParentId?: string;
  submitLabel?: string;
  onSubmit: (values: CategoryFormSchemaValues) => Promise<void> | void;
};

export function CategoryForm({
  defaultValues,
  excludeParentId,
  submitLabel = 'Save category',
  onSubmit,
}: CategoryFormProps) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<
    CategoryFormInput,
    unknown,
    CategoryFormSchemaValues
  >({
    defaultValues: {
      bannerUrl: '',
      description: '',
      displayOrder: 0,
      iconUrl: '',
      isFeatured: false,
      isVisible: true,
      name: '',
      parentCategoryId: '',
      status: CATALOG_STATUS.ACTIVE,
      ...defaultValues,
    },
    resolver: zodResolver(categoryFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 720 }}
      onSubmit={handleSubmit(async (values) => onSubmit(values))}
    >
      <Input error={formState.errors.name?.message} label="Name" {...register('name')} />
      <Input error={formState.errors.description?.message} label="Description" {...register('description')} />
      <CategorySelect
        error={formState.errors.parentCategoryId?.message}
        excludeIds={excludeParentId ? [excludeParentId] : undefined}
        label="Parent category"
        onlyRoots
        value={watch('parentCategoryId') ?? ''}
        onChange={(next) => setValue('parentCategoryId', next ?? '', { shouldValidate: true })}
      />
      <Input
        error={formState.errors.displayOrder?.message}
        label="Display order"
        type="number"
        {...register('displayOrder', { valueAsNumber: true })}
      />
      <ImageUploadField
        filePurpose={MEDIA_FILE_PURPOSE.CATEGORY_ICON}
        label="Category icon"
        previewUrl={watch('iconUrl')}
        value={watch('iconMediaFileId')}
        onChange={({ mediaFileId, previewUrl }) => {
          setValue('iconMediaFileId', mediaFileId ?? undefined, { shouldValidate: true });
          setValue('iconUrl', previewUrl ?? '', { shouldValidate: true });
        }}
      />
      <ImageUploadField
        filePurpose={MEDIA_FILE_PURPOSE.CATEGORY_BANNER}
        label="Category banner"
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
        <label htmlFor="category-status">Status</label>
        <select
          id="category-status"
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
