export type CustomerProfileResponse = {
  customerId: string;
  phone: string;
  name: string | null;
  email: string | null;
};

export type UpdateCustomerProfileBody = {
  name?: string | null;
  email?: string | null;
};
