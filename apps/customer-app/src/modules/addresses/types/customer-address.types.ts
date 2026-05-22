export type CustomerAddress = {
  id: string;
  label: string;
  line1: string;
  line2: string | null;
  landmark: string | null;
  city: string;
  cityId: string | null;
  state: string | null;
  postalCode: string | null;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};

export type CreateCustomerAddressInput = {
  label: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  cityId?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
};

export type UpdateCustomerAddressInput = Partial<CreateCustomerAddressInput>;
