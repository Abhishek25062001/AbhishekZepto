import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { MainStackParamList } from '../../../app/navigation.types';
import { Button, Loader, ScreenWrapper } from '../../../components/common';
import { colors, spacing } from '../../../theme';
import { useLocationContext } from '../../addresses/hooks/useLocationContext';
import { useCustomerAddresses } from '../../addresses/hooks/useCustomerAddresses';
import type { CustomerAddress } from '../../addresses/types/customer-address.types';
import { useCustomerCart } from '../../cart/hooks/useCustomerCart';
import { CheckoutAddressSelector } from '../components/CheckoutAddressSelector';
import { CheckoutErrorState } from '../components/CheckoutErrorState';
import { CheckoutReservationBanner } from '../components/CheckoutReservationBanner';
import { CheckoutSummaryBreakdown } from '../components/CheckoutSummaryBreakdown';
import { useCancelCheckout } from '../hooks/useCancelCheckout';
import { useInitiateCheckout } from '../hooks/useInitiateCheckout';
import type { CheckoutSummary, InitiateCheckoutResponse } from '../types/checkout.types';
import {
  getCheckoutErrorMessage,
  isCheckoutAddressUnserviceableError,
  isCheckoutPriceChangedError,
  isCheckoutSessionExpiredError,
  isCheckoutStockUnavailableError,
} from '../utils/customer-checkout-error-message.util';
import { PaymentErrorState } from '../../payment/components/PaymentErrorState';
import { PaymentProcessingOverlay } from '../../payment/components/PaymentProcessingOverlay';
import { useCheckoutPayment } from '../../payment/hooks/useCheckoutPayment';
import {
  clearActiveCheckoutSessionId,
  getActiveCheckoutSessionId,
} from '../utils/checkout-session-storage.util';

export function CheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { hasStore, selectedAddressId } = useLocationContext();
  const { query: addressesQuery } = useCustomerAddresses();
  const { hasItems } = useCustomerCart();
  const initiateMutation = useInitiateCheckout();
  const cancelMutation = useCancelCheckout();
  const checkoutPayment = useCheckoutPayment();

  const [checkoutData, setCheckoutData] = useState<InitiateCheckoutResponse | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [lastInitiatedAddressId, setLastInitiatedAddressId] = useState<string | null>(null);

  const addresses = addressesQuery.data ?? [];

  const selectedAddress = useMemo((): CustomerAddress | null => {
    if (!addresses.length) {
      return null;
    }

    if (selectedAddressId) {
      return addresses.find((address) => address.id === selectedAddressId) ?? null;
    }

    return addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;
  }, [addresses, selectedAddressId]);

  const summary: CheckoutSummary | null = checkoutData?.summary ?? null;
  const reservationExpiresAt = checkoutData?.reservationExpiresAt ?? null;

  const runInitiate = useCallback(
    (addressId: string) => {
      setSessionExpired(false);
      checkoutPayment.reset();
      initiateMutation.mutate(
        { addressId },
        {
          onSuccess: (data) => {
            setCheckoutData(data);
            setLastInitiatedAddressId(addressId);
          },
        },
      );
    },
    [checkoutPayment, initiateMutation],
  );

  useFocusEffect(
    useCallback(() => {
      if (!hasStore || !hasItems || sessionExpired) {
        return;
      }

      if (selectedAddress?.id && selectedAddress.id !== lastInitiatedAddressId) {
        runInitiate(selectedAddress.id);
      }
    }, [
      hasItems,
      hasStore,
      lastInitiatedAddressId,
      runInitiate,
      selectedAddress?.id,
      sessionExpired,
    ]),
  );

  const handleBack = () => {
    if (!getActiveCheckoutSessionId()) {
      navigation.goBack();
      return;
    }

    Alert.alert('Cancel checkout?', 'Your reserved items will be released.', [
      { text: 'Stay', style: 'cancel' },
      {
        text: 'Leave',
        style: 'destructive',
        onPress: () => {
          cancelMutation.mutate('user_navigated_back', {
            onSettled: () => {
              setCheckoutData(null);
              clearActiveCheckoutSessionId();
              navigation.goBack();
            },
          });
        },
      },
    ]);
  };

  const handleReservationExpired = () => {
    setSessionExpired(true);
    clearActiveCheckoutSessionId();
    setCheckoutData(null);
    checkoutPayment.reset();
  };

  const canPay =
    Boolean(checkoutData) &&
    !sessionExpired &&
    !initiateMutation.isPending &&
    !checkoutPayment.isProcessing &&
    !checkoutPayment.isSuccess;

  const handlePay = () => {
    void checkoutPayment.pay();
  };

  const paymentMissingOrderId =
    checkoutPayment.isSuccess &&
    checkoutPayment.paymentResult?.status === 'paid' &&
    !checkoutPayment.paymentResult.orderId;

  useEffect(() => {
    const orderId = checkoutPayment.paymentResult?.orderId;

    if (checkoutPayment.isSuccess && orderId) {
      clearActiveCheckoutSessionId();
      navigation.replace('OrderSuccess', { orderId });
    }
  }, [checkoutPayment.isSuccess, checkoutPayment.paymentResult?.orderId, navigation]);

  const handleChangeAddress = () => {
    navigation.navigate('Addresses', { screen: 'AddressList' });
  };

  const handleAddAddress = () => {
    navigation.navigate('Addresses', { screen: 'AddressForm' });
  };

  const initiateError = initiateMutation.error;

  if (!hasStore) {
    return (
      <ScreenWrapper>
        <CheckoutErrorState
          message="Select a store before checkout."
          primaryLabel="Choose location"
          onPrimaryAction={() => navigation.navigate('LocationGate')}
        />
      </ScreenWrapper>
    );
  }

  if (!hasItems) {
    return (
      <ScreenWrapper>
        <CheckoutErrorState
          message="Add items to your cart before checkout."
          primaryLabel="Go to cart"
          onPrimaryAction={() => navigation.navigate('Cart')}
        />
      </ScreenWrapper>
    );
  }

  if (initiateError && !checkoutData) {
    const message = getCheckoutErrorMessage(initiateError, 'Unable to start checkout.');

    if (isCheckoutPriceChangedError(initiateError)) {
      return (
        <ScreenWrapper>
          <CheckoutErrorState
            message={message}
            primaryLabel="Go to cart"
            onPrimaryAction={() => navigation.navigate('Cart')}
          />
        </ScreenWrapper>
      );
    }

    if (isCheckoutStockUnavailableError(initiateError)) {
      return (
        <ScreenWrapper>
          <CheckoutErrorState
            message={message}
            primaryLabel="Update cart"
            onPrimaryAction={() => navigation.navigate('Cart')}
          />
        </ScreenWrapper>
      );
    }

    if (isCheckoutAddressUnserviceableError(initiateError)) {
      return (
        <ScreenWrapper>
          <CheckoutErrorState
            message={message}
            primaryLabel="Change address"
            onPrimaryAction={handleChangeAddress}
          />
        </ScreenWrapper>
      );
    }

    if (isCheckoutSessionExpiredError(initiateError)) {
      return (
        <ScreenWrapper>
          <CheckoutErrorState
            message={message}
            primaryLabel="Try again"
            onPrimaryAction={() => {
              if (selectedAddress?.id) {
                runInitiate(selectedAddress.id);
              }
            }}
          />
        </ScreenWrapper>
      );
    }

    return (
      <ScreenWrapper>
        <CheckoutErrorState
          message={message}
          primaryLabel="Try again"
          onPrimaryAction={() => {
            if (selectedAddress?.id) {
              runInitiate(selectedAddress.id);
            }
          }}
          secondaryLabel="Go to cart"
          onSecondaryAction={() => navigation.navigate('Cart')}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper scrollable={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <CheckoutAddressSelector
          address={selectedAddress}
          onAddAddress={handleAddAddress}
          onChangeAddress={handleChangeAddress}
        />

        {initiateMutation.isPending && !checkoutData ? <Loader /> : null}

        {checkoutData ? (
          <>
            <CheckoutReservationBanner
              expiresAt={reservationExpiresAt}
              onExpired={handleReservationExpired}
            />
            {summary ? <CheckoutSummaryBreakdown summary={summary} /> : null}
          </>
        ) : null}

        {sessionExpired ? (
          <CheckoutErrorState
            message="Your reservation has expired."
            primaryLabel="Start again"
            onPrimaryAction={() => {
              setSessionExpired(false);
              if (selectedAddress?.id) {
                runInitiate(selectedAddress.id);
              }
            }}
            secondaryLabel="Go to cart"
            onSecondaryAction={() => navigation.navigate('Cart')}
          />
        ) : null}

        {paymentMissingOrderId ? (
          <PaymentErrorState
            message="Payment succeeded but we could not confirm your order. Please contact support."
            onDismiss={checkoutPayment.reset}
            onRetry={checkoutPayment.reset}
          />
        ) : null}

        {checkoutPayment.errorMessage && !checkoutPayment.isSuccess && !paymentMissingOrderId ? (
          <PaymentErrorState
            message={checkoutPayment.errorMessage}
            onDismiss={checkoutPayment.reset}
            onRetry={() => {
              checkoutPayment.reset();
              void checkoutPayment.pay();
            }}
          />
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          disabled={!canPay}
          loading={checkoutPayment.isProcessing}
          onPress={handlePay}
          title="Pay now"
        />
        <Button onPress={handleBack} title="Cancel checkout" variant="ghost" />
      </View>

      <PaymentProcessingOverlay visible={checkoutPayment.isProcessing} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footer: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
});
