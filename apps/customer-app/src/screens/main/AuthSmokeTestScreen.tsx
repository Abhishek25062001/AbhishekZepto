import React from 'react';

import { Button, ErrorView, Loader, ScreenWrapper, Text } from '../../components/common';
import { useCustomerPermissions } from '../../hooks/useCustomerPermissions';

export function AuthSmokeTestScreen() {
  const permissionsQuery = useCustomerPermissions();

  return (
    <ScreenWrapper>
      <Text variant="h2">Customer Auth Smoke Test</Text>
      <Button
        loading={permissionsQuery.isFetching}
        onPress={() => void permissionsQuery.refetch()}
        title="Call customer permissions endpoint"
      />
      {permissionsQuery.isFetching ? <Loader /> : null}
      {permissionsQuery.error ? (
        <ErrorView message="Customer permissions request failed." />
      ) : null}
      {permissionsQuery.data ? (
        <>
          <Text color="secondary">Customer ID: {permissionsQuery.data.customerId}</Text>
          <Text color="secondary">Role: {permissionsQuery.data.role}</Text>
          <Text color="secondary">
            Permissions count: {permissionsQuery.data.permissions.length}
          </Text>
        </>
      ) : null}
    </ScreenWrapper>
  );
}
