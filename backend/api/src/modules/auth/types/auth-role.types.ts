import { AUTH_ROLE } from '../constants/auth-role.constants';

export type AuthRole = (typeof AUTH_ROLE)[keyof typeof AUTH_ROLE];
