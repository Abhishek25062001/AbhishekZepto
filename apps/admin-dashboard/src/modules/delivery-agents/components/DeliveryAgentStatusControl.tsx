import { useState, type FormEvent } from 'react';

import { Button, Input, Modal } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { DELIVERY_AGENT_STATUS_OPTIONS } from '../constants/admin-delivery-agents.constants';
import { useUpdateAdminDeliveryAgentStatusMutation } from '../hooks/useAdminDeliveryAgentMutations';
import type {
  AdminDeliveryAgentSummary,
  DeliveryAgentManagementStatus,
} from '../types/admin-delivery-agents.types';
import {
  deliveryAgentStatusFormSchema,
  type DeliveryAgentStatusFormValues,
} from '../validators/delivery-agent-form.schema';

type DeliveryAgentStatusControlProps = {
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

const statusFromAgent = (agent: AdminDeliveryAgentSummary): DeliveryAgentManagementStatus =>
  agent.isActive ? 'active' : 'inactive';

export function DeliveryAgentStatusControl({
  agent,
  onClose,
  open,
}: DeliveryAgentStatusControlProps) {
  const [values, setValues] = useState<DeliveryAgentStatusFormValues>({
    status: statusFromAgent(agent),
    reason: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useUpdateAdminDeliveryAgentStatusMutation(agent.agentId);

  const close = () => {
    setValues({ status: statusFromAgent(agent), reason: '' });
    setFormError(null);
    onClose();
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = deliveryAgentStatusFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'A reason is required.');
      return;
    }

    mutation.mutate({
      status: parsed.data.status as DeliveryAgentManagementStatus,
      reason: parsed.data.reason,
    }, {
      onError: error => setFormError(
        getApiErrorMessage(error, 'Unable to update delivery agent status.'),
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
            form="delivery-agent-status-form"
            loading={mutation.isPending}
            type="submit"
            variant="danger"
          >
            Update Status
          </Button>
        </div>
      )}
      onClose={close}
      open={open}
      title="Update Delivery Agent Status"
    >
      <form
        id="delivery-agent-status-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Status</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              status: event.target.value as DeliveryAgentManagementStatus,
            }))}
            style={selectStyle}
            value={values.status}
          >
            {DELIVERY_AGENT_STATUS_OPTIONS.map(option => (
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
