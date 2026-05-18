import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../../../components/common';
import { CitySelect } from '../components/CitySelect';
import { LOCATION_STATUS, LOCATION_STATUS_LABELS } from '../constants/store.constants';
import {
  serviceAreaFormSchema,
  toServiceAreaPayload,
  type ServiceAreaFormInput,
  type ServiceAreaFormSchemaValues,
} from './service-area.schema';

export { serviceAreaFormSchema } from './service-area.schema';

type Props = {
  defaultValues?: Partial<ServiceAreaFormInput>;
  submitLabel?: string;
  onSubmit: (values: ServiceAreaFormSchemaValues) => Promise<void> | void;
};

export function ServiceAreaForm({ defaultValues, submitLabel = 'Save service area', onSubmit }: Props) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<ServiceAreaFormInput>({
    defaultValues: { isServiceable: true, status: LOCATION_STATUS.ACTIVE, ...defaultValues },
    resolver: zodResolver(serviceAreaFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 720 }}
      onSubmit={handleSubmit((values) => onSubmit(toServiceAreaPayload(serviceAreaFormSchema.parse(values))))}
    >
      <CitySelect
        error={formState.errors.cityId?.message}
        value={watch('cityId')}
        onChange={(id) => setValue('cityId', id ?? '', { shouldValidate: true })}
      />
      <Input error={formState.errors.name?.message} label="Name" {...register('name')} />
      <label style={{ display: 'grid', gap: '6px' }}>
        Polygon JSON (optional)
        <textarea {...register('polygonJson')} rows={4} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }} />
      </label>
      {formState.errors.polygonJson ? <span style={{ color: 'var(--color-error)' }}>{formState.errors.polygonJson.message}</span> : null}
      <label style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
        <input type="checkbox" {...register('isServiceable')} /> Serviceable
      </label>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="sa-status">Status</label>
        <select id="sa-status" {...register('status')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(LOCATION_STATUS).map((s) => (
            <option key={s} value={s}>{LOCATION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="primary">{submitLabel}</Button>
    </form>
  );
}
