import { AUTH_ROLE } from '../constants/auth-role.constants';
import { requireRole } from './require-role.middleware';

const vendorRoles = [
  AUTH_ROLE.VENDOR_OWNER,
  AUTH_ROLE.STORE_MANAGER,
  AUTH_ROLE.STORE_STAFF,
] as const;

const adminRoles = [
  AUTH_ROLE.SUPPORT_ADMIN,
  AUTH_ROLE.OPERATIONS_ADMIN,
  AUTH_ROLE.SUPER_ADMIN,
] as const;

export const requireCustomer = () => requireRole([AUTH_ROLE.CUSTOMER]);

export const requireDeliveryAgent = () => requireRole([AUTH_ROLE.DELIVERY_AGENT]);

export const requireVendorUser = () => requireRole(vendorRoles);

export const requireAdminUser = () => requireRole(adminRoles);

export const requireSuperAdmin = () => requireRole([AUTH_ROLE.SUPER_ADMIN]);
