import React from 'react';

import { Button, ErrorView, Loader, ScreenWrapper, Text } from '../../components/common';
import { useDeliveryPermissions } from '../../hooks/useDeliveryPermissions';

export function AuthSmokeTestScreen() {
  const permissionsQuery = useDeliveryPermissions();

  return (
    <ScreenWrapper>
      <Text variant="h2">Delivery Auth Smoke Test</Text>
      <Button
        loading={permissionsQuery.isFetching}
        onPress={() => void permissionsQuery.refetch()}
        title="Call delivery permissions endpoint"
      />
      {permissionsQuery.isFetching ? <Loader /> : null}
      {permissionsQuery.error ? (
        <ErrorView message="Delivery permissions request failed." />
      ) : null}
      {permissionsQuery.data ? (
        <>
          <Text color="secondary">
            Delivery Agent ID: {permissionsQuery.data.deliveryAgentId}
          </Text>
          <Text color="secondary">Role: {permissionsQuery.data.role}</Text>
          <Text color="secondary">
            Permissions count: {permissionsQuery.data.permissions.length}
          </Text>
        </>
      ) : null}
    </ScreenWrapper>
  );
}
