export type CustomerProfile = {
  customerId: string;
  phone: string;
  name: string | null;
  email: string | null;
};

export type UpdateCustomerProfileInput = {
  name?: string | null;
  email?: string | null;
};

export type ProfileFormState = {
  name: string;
  email: string;
};
