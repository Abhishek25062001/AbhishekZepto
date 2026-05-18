import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../../../components/common';
import { LOCATION_STATUS, LOCATION_STATUS_LABELS } from '../constants/store.constants';
import { cityFormSchema, type CityFormInput, type CityFormSchemaValues } from './city.schema';

export { cityFormSchema } from './city.schema';

type Props = {
  defaultValues?: Partial<CityFormInput>;
  submitLabel?: string;
  onSubmit: (values: CityFormSchemaValues) => Promise<void> | void;
};

export function CityForm({ defaultValues, submitLabel = 'Save city', onSubmit }: Props) {
  const { formState, handleSubmit, register } = useForm<CityFormInput>({
    defaultValues: {
      country: 'India',
      currencyCode: 'INR',
      isServiceable: true,
      status: LOCATION_STATUS.ACTIVE,
      timezone: 'Asia/Kolkata',
      ...defaultValues,
    },
    resolver: zodResolver(cityFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 720 }}
      onSubmit={handleSubmit((values) => onSubmit(cityFormSchema.parse(values)))}
    >
      <Input error={formState.errors.name?.message} label="Name" {...register('name')} />
      <Input error={formState.errors.state?.message} label="State" {...register('state')} />
      <Input error={formState.errors.country?.message} label="Country" {...register('country')} />
      <Input error={formState.errors.timezone?.message} label="Timezone" {...register('timezone')} />
      <Input error={formState.errors.currencyCode?.message} label="Currency code" {...register('currencyCode')} />
      <Input error={formState.errors.serviceRadiusKm?.message} label="Service radius (km)" type="number" step="any" {...register('serviceRadiusKm')} />
      <label style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
        <input type="checkbox" {...register('isServiceable')} /> Serviceable
      </label>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="city-status">Status</label>
        <select id="city-status" {...register('status')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(LOCATION_STATUS).map((s) => (
            <option key={s} value={s}>{LOCATION_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="primary">{submitLabel}</Button>
    </form>
  );
}
