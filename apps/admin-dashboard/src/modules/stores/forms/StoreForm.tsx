import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button, Input } from '../../../components/common';
import { CitySelect } from '../components/CitySelect';
import {
  FULFILLMENT_TYPE,
  FULFILLMENT_TYPE_LABELS,
  STORE_STATUS,
  STORE_STATUS_LABELS,
  STORE_TYPE,
  STORE_TYPE_LABELS,
} from '../constants/store.constants';
import { storeFormSchema, type StoreFormInput, type StoreFormSchemaValues } from './store.schema';

export { storeFormSchema } from './store.schema';

const OPERATING_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

type StoreFormProps = {
  defaultValues?: Partial<StoreFormInput>;
  submitLabel?: string;
  onSubmit: (values: StoreFormSchemaValues) => Promise<void> | void;
};

export function StoreForm({ defaultValues, submitLabel = 'Save store', onSubmit }: StoreFormProps) {
  const { formState, handleSubmit, register, setValue, watch } = useForm<StoreFormInput>({
    defaultValues: {
      fulfillmentType: FULFILLMENT_TYPE.DELIVERY,
      isAcceptingOrders: true,
      isOpen: true,
      operatingDays: OPERATING_DAYS,
      status: STORE_STATUS.ACTIVE,
      storeType: STORE_TYPE.GROCERY,
      ...defaultValues,
    },
    resolver: zodResolver(storeFormSchema),
  });

  return (
    <form
      style={{ display: 'grid', gap: 'var(--spacing-lg)', maxWidth: 900 }}
      onSubmit={handleSubmit((values) => onSubmit(storeFormSchema.parse(values)))}
    >
      <Input error={formState.errors.vendorId?.message} label="Vendor ID" {...register('vendorId')} />
      <CitySelect
        error={formState.errors.cityId?.message}
        value={watch('cityId')}
        onChange={(cityId) => setValue('cityId', cityId ?? '', { shouldValidate: true })}
      />
      <Input error={formState.errors.name?.message} label="Name" {...register('name')} />
      <Input error={formState.errors.phone?.message} label="Phone" {...register('phone')} />
      <Input error={formState.errors.email?.message} label="Email" {...register('email')} />
      <Input error={formState.errors.addressLine1?.message} label="Address line 1" {...register('addressLine1')} />
      <Input error={formState.errors.pincode?.message} label="Pincode" {...register('pincode')} />
      <Input
        error={formState.errors.latitude?.message}
        label="Latitude"
        step="any"
        type="number"
        {...register('latitude')}
      />
      <Input
        error={formState.errors.longitude?.message}
        label="Longitude"
        step="any"
        type="number"
        {...register('longitude')}
      />
      <Input
        error={formState.errors.serviceRadiusKm?.message}
        label="Service radius (km)"
        step="any"
        type="number"
        {...register('serviceRadiusKm')}
      />
      <Input error={formState.errors.openingTime?.message} label="Opening time" {...register('openingTime')} />
      <Input error={formState.errors.closingTime?.message} label="Closing time" {...register('closingTime')} />
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isOpen')} />
        Open
      </label>
      <label style={{ alignItems: 'center', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <input type="checkbox" {...register('isAcceptingOrders')} />
        Accepting orders
      </label>
      <Input
        error={formState.errors.temporaryClosureReason?.message}
        label="Closure reason"
        {...register('temporaryClosureReason')}
      />
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="store-type">Store type</label>
        <select id="store-type" {...register('storeType')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(STORE_TYPE).map((value) => (
            <option key={value} value={value}>{STORE_TYPE_LABELS[value]}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="fulfillment">Fulfillment</label>
        <select id="fulfillment" {...register('fulfillmentType')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(FULFILLMENT_TYPE).map((value) => (
            <option key={value} value={value}>{FULFILLMENT_TYPE_LABELS[value]}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'grid', gap: '6px' }}>
        <label htmlFor="store-status">Status</label>
        <select id="store-status" {...register('status')} style={{ borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)' }}>
          {Object.values(STORE_STATUS).map((value) => (
            <option key={value} value={value}>{STORE_STATUS_LABELS[value]}</option>
          ))}
        </select>
      </div>
      <Button type="submit" variant="primary">
        {submitLabel}
      </Button>
    </form>
  );
}
