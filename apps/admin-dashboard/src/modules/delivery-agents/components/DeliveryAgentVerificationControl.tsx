import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { DELIVERY_AGENT_VERIFICATION_OPTIONS } from '../constants/admin-delivery-agents.constants';
import { useUpdateAdminDeliveryAgentVerificationMutation } from '../hooks/useAdminDeliveryAgentMutations';
import type {
  AdminDeliveryAgentSummary,
  DeliveryAgentVerificationStatus,
} from '../types/admin-delivery-agents.types';
import {
  deliveryAgentVerificationFormSchema,
  type DeliveryAgentVerificationFormValues,
} from '../validators/delivery-agent-form.schema';

type DeliveryAgentVerificationControlProps = {
  agent: AdminDeliveryAgentSummary;
  onClose: () => void;
  open: boolean;
};

const selectStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
} as const;

const verificationFromAgent = (agent: AdminDeliveryAgentSummary): DeliveryAgentVerificationStatus =>
  agent.isVerified ? 'verified' : 'unverified';

export function DeliveryAgentVerificationControl({
  agent,
  onClose,
  open,
}: DeliveryAgentVerificationControlProps) {
  const [values, setValues] = useState<DeliveryAgentVerificationFormValues>({
    verificationStatus: verificationFromAgent(agent),
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminDeliveryAgentVerificationMutation(agent.agentId);

  const close = () => {
    setValues({ verificationStatus: verificationFromAgent(agent), reason: '' });
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = deliveryAgentVerificationFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'A reason is required.');
      return;
    }

    mutation.mutate({
      verificationStatus: parsed.data.verificationStatus as DeliveryAgentVerificationStatus,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(
        getApiErrorMessage(error, 'Unable to update delivery agent verification.'),
      ),
      onSuccess: close,
    });
  };

  return (
    <Modal
      footer={(
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
          <Button disabled={mutation.isPending} onClick={close} type="button" variant="ghost">
            Cancel
          </Button>
          <Button
            form="delivery-agent-verification-form"
            loading={mutation.isPending}
            type="submit"
            variant="secondary"
          >
            Update Verification
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Update Delivery Agent Verification"
    >
      <form
        id="delivery-agent-verification-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Verification</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              verificationStatus: event.target.value as DeliveryAgentVerificationStatus,
            }))}
            style={selectStyle}
            value={values.verificationStatus}
          >
            {DELIVERY_AGENT_VERIFICATION_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <Input
          disabled={mutation.isPending}
          label="Reason"
          onChange={event => setValues(previous => ({ ...previous, reason: event.target.value }))}
          required
          value={values.reason}
        />
      </form>
    </Modal>
  );
}
