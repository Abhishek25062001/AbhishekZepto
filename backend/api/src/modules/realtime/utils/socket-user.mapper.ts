import type { Types } from 'mongoose';
import type { AuthTokenPayload } from '../../auth/types/auth-token.types';
import type { PermissionCode } from '../../auth/types/auth-permission.types';
import type { AuthRole } from '../../auth/types/auth-role.types';
import type { SocketAuthPayload } from '../types/socket.types';

type SocketUserSource = {
  _id: Types.ObjectId;
  role: AuthRole;
  permissions: string[];
  vendorId?: Types.ObjectId | null;
  storeId?: Types.ObjectId | null;
  cityId?: Types.ObjectId | null;
};

type SocketSessionSource = {
  _id: Types.ObjectId;
};

const toNullableString = (value?: Types.ObjectId | string | null): string | null => {
  return value ? value.toString() : null;
};

export const mapSocketUserPayload = ({
  tokenPayload,
  user,
  session,
  permissions,
}: {
  tokenPayload: AuthTokenPayload;
  user: SocketUserSource;
  session: SocketSessionSource;
  permissions: PermissionCode[];
}): SocketAuthPayload => {
  return {
    userId: user._id.toString(),
    role: user.role,
    permissions,
    sessionId: session._id.toString(),
    vendorId: toNullableString(user.vendorId ?? tokenPayload.vendorId ?? null),
    storeId: toNullableString(user.storeId ?? tokenPayload.storeId ?? null),
    cityId: toNullableString(user.cityId ?? tokenPayload.cityId ?? null),
  };
};
