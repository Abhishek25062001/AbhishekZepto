import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { CATALOG_STATUS } from '../constants/catalog-status.constants';
import { FOOD_TYPE, PRODUCT_TYPE } from '../constants/product.constants';
import { MEDIA_FILE_PURPOSE } from '../constants/media-purpose.constants';
import { BrandSelect } from '../components/BrandSelect';
import { CategorySelect } from '../components/CategorySelect';
import { ImageUploadField } from '../components/ImageUploadField';
import { productFormSchema, type ProductFormInput, type ProductFormSchemaValues } from './product-form.schema';

export { productFormSchema } from './product-form.schema';
export type { ProductFormInput, ProductFormSchemaValues } from './product-form.schema';

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  [PRODUCT_TYPE.SIMPLE]: 'Simple',
  [PRODUCT_TYPE.BUNDLE_PLACEHOLDER]: 'Bundle placeholder',
};

const FOOD_TYPE_LABELS: Record<string, string> = {
  [FOOD_TYPE.VEG]: 'Vegetarian',
  [FOOD_TYPE.NON_VEG]: 'Non-vegetarian',
  [FOOD_TYPE.EGG]: 'Egg',
  [FOOD_TYPE.NOT_APPLICABLE]: 'Not applicable',
};

type ProductFormProps = {
  defaultValues?: Partial<ProductFormInput>;
  submitLabel?: string;
  onSubmit: (values: ProductFormSchemaValues) => Promise<void> | void;
};

export function ProductForm({ defaultValues, submitLabel = 'Save product', onSubmit }: ProductFormProps) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<ProductFormInput>({
    defaultValues: {
      brandId: '',
      categoryId: '',
      description: '',
      foodType: undefined,
      hsnCode: '',
      isFeatured: false,
      isVisible: true,
      name: '',
      productType: PRODUCT_TYPE.SIMPLE,
      searchKeywords: [],
      shortDescription: '',
      status: CATALOG_STATUS.ACTIVE,
      subcategoryId: '',
      tags: [],
      taxCategoryId: '',
      ...defaultValues,
    },
    resolver: zodResolver(productFormSchema),
  });

  const categoryId = watch('categoryId');
  const keywords = watch('searchKeywords') ?? [];
  const tags = watch('tags') ?? [];

  const hasInitializedCategoryEffect = useRef(false);

  useEffect(() => {
    if (!hasInitializedCategoryEffect.current) {
      hasInitializedCategoryEffect.current = true;
      return;
    }
    setValue('subcategoryId', '', { shouldValidate: true });
  }, [categoryId, setValue]);

  const [keywordsText, setKeywordsText] = useState(() => keywords.join(', '));
  const [tagsText, setTagsText] = useState(() => tags.join(', '));

  useEffect(() => {
    setKeywordsText(keywords.join(', '));
  }, [keywords]);

  useEffect(() => {
    setTagsText(tags.join(', '));
  }, [tags]);

  const foodTypeOptions = useMemo(() => Object.values(FOOD_TYPE), []);
  const productTypeOptions = useMemo(() => [PRODUCT_TYPE.SIMPLE, PRODUCT_TYPE.BUNDLE_PLACEHOLDER], []);

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 800 }}
      onSubmit={handleSubmit(async (values) => onSubmit(values as ProductFormSchemaValues))}
    >
      <Input error={formState.errors.name?.message} label="Name" {...register('name')} />
      <Input error={formState.errors.shortDescription?.message} label="Short description" {...register('shortDescription')} />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="product-description">Description</label>
        <textarea
          id="product-description"
          {...register('description')}
          rows={5}
          style={{
            borderColor: formState.errors.description ? 'var(--color-error)' : 'var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
          }}
        />
        {formState.errors.description ? (
          <span style={{ color: 'var(--color-error)' }}>{formState.errors.description.message}</span>
        ) : null}
      </div>
      <CategorySelect
        error={formState.errors.categoryId?.message}
        label="Category"
        onlyRoots
        value={categoryId}
        onChange={(next) => setValue('categoryId', next ?? '', { shouldValidate: true })}
      />
      <CategorySelect
        disabled={!categoryId}
        error={formState.errors.subcategoryId?.message}
        label="Subcategory"
        onlyChildOf={categoryId || null}
        value={watch('subcategoryId') ?? ''}
        onChange={(next) => setValue('subcategoryId', next ?? '', { shouldValidate: true })}
      />
      <BrandSelect
        error={formState.errors.brandId?.message}
        value={watch('brandId') ?? ''}
        onChange={(next) => setValue('brandId', next ?? '', { shouldValidate: true })}
      />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="product-type">Product type</label>
        <select
          id="product-type"
          {...register('productType')}
          style={{
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
          }}
        >
          {productTypeOptions.map((type) => (
            <option key={type} value={type}>
              {PRODUCT_TYPE_LABELS[type] ?? type}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="food-type">Food type</label>
        <select
          id="food-type"
          {...register('foodType')}
          style={{
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
          }}
        >
          <option value="">Not specified</option>
          {foodTypeOptions.map((type) => (
            <option key={type} value={type}>
              {FOOD_TYPE_LABELS[type] ?? type}
            </option>
          ))}
        </select>
      </div>
      <Input error={formState.errors.taxCategoryId?.message} label="Tax category ID" {...register('taxCategoryId')} />
      <Input error={formState.errors.hsnCode?.message} label="HSN code" {...register('hsnCode')} />
      <Input
        error={formState.errors.searchKeywords?.message}
        label="Search keywords (comma separated)"
        value={keywordsText}
        onChange={(event) => {
          const next = event.target.value;
          setKeywordsText(next);
          const parts = next
            .split(',')
            .map((token) => token.trim())
            .filter(Boolean);
          setValue('searchKeywords', parts.length ? parts : undefined, { shouldValidate: true });
        }}
      />
      <Input
        error={formState.errors.tags?.message}
        label="Tags (comma separated)"
        value={tagsText}
        onChange={(event) => {
          const next = event.target.value;
          setTagsText(next);
          const parts = next
            .split(',')
            .map((token) => token.trim())
            .filter(Boolean);
          setValue('tags', parts.length ? parts : undefined, { shouldValidate: true });
        }}
      />
      <ImageUploadField
        filePurpose={MEDIA_FILE_PURPOSE.PRODUCT_MAIN_IMAGE}
        label="Default image"
        previewUrl={watch('defaultImageUrl')}
        value={watch('defaultImageMediaFileId')}
        onChange={({ mediaFileId, previewUrl }) => {
          setValue('defaultImageMediaFileId', mediaFileId ?? undefined, { shouldValidate: true });
          setValue('defaultImageUrl', previewUrl ?? '', { shouldValidate: true });
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
        <label htmlFor="product-status">Status</label>
        <select
          id="product-status"
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
