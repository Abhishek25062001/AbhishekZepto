import { useState, type FormEvent } from 'react';

import { Button, Card, Input } from '../../../components/common';
import { getApiErrorMessage } from '../../../utils/error-message.util';
import { useCreateDataExportMutation } from '../hooks/useDataExportMutations';
import {
  DATA_EXPORT_FORMATS,
  DATA_EXPORT_TYPES,
  type DataExportFormat,
  type DataExportType,
} from '../types/data-export.types';
import { formatDataExportLabel } from '../utils/data-export-display.util';
import {
  dataExportRequestFormSchema,
  parseDataExportFilters,
  type DataExportRequestFormValues,
} from '../validators/data-export-request-form.schema';

const defaultValues: DataExportRequestFormValues = {
  exportType: 'customers',
  format: 'csv',
  filtersText: '{}',
  reason: '',
};

const fieldStyle = {
  display: 'grid',
  gap: 6,
} as const;

const controlStyle = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--color-text-primary)',
  minHeight: 44,
  padding: 'var(--spacing-sm) var(--spacing-md)',
} as const;

export function DataExportRequestForm() {
  const [values, setValues] = useState<DataExportRequestFormValues>(defaultValues);
  const [formError, setFormError] = useState<string | null>(null);
  const mutation = useCreateDataExportMutation();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = dataExportRequestFormSchema.safeParse(values);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Please check the export request fields.');
      return;
    }

    try {
      const filters = parseDataExportFilters(parsed.data.filtersText);

      mutation.mutate(
        {
          exportType: parsed.data.exportType,
          format: parsed.data.format,
          filters,
          reason: parsed.data.reason,
        },
        {
          onError: error => setFormError(getApiErrorMessage(error, 'Unable to queue export request.')),
          onSuccess: () => setValues(defaultValues),
        },
      );
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Enter valid filters JSON.');
    }
  };

  return (
    <Card title="Queue export request">
      <form
        id="data-export-request-form"
        onSubmit={submit}
        style={{ display: 'grid', gap: 'var(--spacing-md)' }}
      >
        {formError ? <p role="alert" style={{ color: 'var(--color-error)' }}>{formError}</p> : null}
        <label style={fieldStyle}>
          <span>Export type</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              exportType: event.target.value as DataExportType,
            }))}
            style={controlStyle}
            value={values.exportType}
          >
            {DATA_EXPORT_TYPES.map((type) => (
              <option key={type} value={type}>
                {formatDataExportLabel(type)}
              </option>
            ))}
          </select>
        </label>
        <label style={fieldStyle}>
          <span>Format</span>
          <select
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              format: event.target.value as DataExportFormat,
            }))}
            style={controlStyle}
            value={values.format}
          >
            {DATA_EXPORT_FORMATS.map((format) => (
              <option key={format} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <label style={fieldStyle}>
          <span>Filters</span>
          <textarea
            disabled={mutation.isPending}
            onChange={event => setValues(previous => ({
              ...previous,
              filtersText: event.target.value,
            }))}
            rows={5}
            style={{ ...controlStyle, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
            value={values.filtersText}
          />
        </label>
        <Input
          disabled={mutation.isPending}
          label="Reason"
          onChange={event => setValues(previous => ({ ...previous, reason: event.target.value }))}
          required
          value={values.reason}
        />
        <Button loading={mutation.isPending} type="submit">
          Queue export
        </Button>
      </form>
    </Card>
  );
}
