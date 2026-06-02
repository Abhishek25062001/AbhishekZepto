import { useEffect, useState } from 'react';

import { Button, Card, Input } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { useUpdatePlatformSettingMutation } from '../hooks/usePlatformSettingMutations';
import type { PlatformSetting } from '../types/platform-settings.types';
import { stringifyPlatformSettingValue } from '../utils/platform-settings-display.util';
import {
  parsePlatformSettingValue,
  platformSettingUpdateFormSchema,
} from '../validators/platform-setting-form.schema';

type PlatformSettingUpdateFormProps = {
  setting: PlatformSetting;
};

const fieldStyle = {
  display: 'grid',
  gap: '6px',
};

const controlStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
};

export function PlatformSettingUpdateForm({ setting }: PlatformSettingUpdateFormProps) {
  const mutation = useUpdatePlatformSettingMutation(setting.key);
  const [valueText, setValueText] = useState(() => stringifyPlatformSettingValue(setting.value));
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setValueText(stringifyPlatformSettingValue(setting.value));
  }, [setting.value]);

  if (!setting.isEditable) return null;

  const inputId = `platform-setting-value-${setting.key}`;
  const reasonId = `platform-setting-reason-${setting.key}`;

  return (
    <Card title="Update setting">
      <form
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
        onSubmit={(event) => {
          event.preventDefault();

          try {
            const parsedValue = parsePlatformSettingValue(valueText, setting.valueType);
            const parsed = platformSettingUpdateFormSchema.safeParse({
              reason,
              value: parsedValue,
            });

            if (!parsed.success) {
              setFormError('Enter a valid value and reason.');
              return;
            }

            setFormError(null);
            mutation.mutate(parsed.data, {
              onSuccess: () => setReason(''),
            });
          } catch (error) {
            setFormError(error instanceof Error ? error.message : 'Enter a valid value.');
          }
        }}
      >
        {setting.valueType === 'boolean' ? (
          <label htmlFor={inputId} style={fieldStyle}>
            <span>Value</span>
            <select
              id={inputId}
              value={valueText}
              onChange={(event) => setValueText(event.target.value)}
              style={controlStyle}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </label>
        ) : null}

        {setting.valueType === 'number' ? (
          <Input
            id={inputId}
            label="Value"
            type="number"
            value={valueText}
            onChange={(event) => setValueText(event.target.value)}
          />
        ) : null}

        {setting.valueType === 'string' ? (
          <Input
            id={inputId}
            label="Value"
            value={valueText}
            onChange={(event) => setValueText(event.target.value)}
          />
        ) : null}

        {setting.valueType === 'json' ? (
          <label htmlFor={inputId} style={fieldStyle}>
            <span>Value</span>
            <textarea
              id={inputId}
              value={valueText}
              onChange={(event) => setValueText(event.target.value)}
              rows={8}
              style={{
                ...controlStyle,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              }}
            />
          </label>
        ) : null}

        <Input
          id={reasonId}
          error={formError ?? undefined}
          label="Reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />

        {mutation.error ? (
          <p style={{ color: 'var(--color-error)', margin: 0 }}>
            {getApiErrorMessage(mutation.error, 'Unable to update platform setting.')}
          </p>
        ) : null}

        <Button loading={mutation.isPending} type="submit">
          Update setting
        </Button>
      </form>
    </Card>
  );
}
