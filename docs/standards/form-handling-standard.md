# Form Handling Standard

## Form Handling Goal

Form handling must be consistent across customer, delivery, vendor, and admin surfaces so validation behavior, error messages, and submit placeholders can evolve without each app inventing its own pattern.

## Validation Standard

All form validation must use schema-based validation.

Zod is the frontend schema validation library for Phase 1 foundations. Form schemas must live near each app surface in a `validators` folder and export both the schema and inferred form value type.

Backend validation remains the final source of truth. Frontend validation exists to provide fast feedback, but API handlers must still validate all incoming request bodies before mutating state.

## Form State Standard

React Hook Form is the standard form state library for complex forms.

Simple placeholders may keep minimal form fields, but new form foundations should use React Hook Form once validation, errors, disabled submit states, or multiple fields are needed.

## Error Display Standard

Field validation errors must be rendered as visible text through the shared input components. Errors must not be communicated only through color.

Form-level API errors must use the surface's shared error view or status component once real endpoints are connected.

## Submit Standard

Submit handlers must validate the Zod schema before continuing to placeholder or API logic.

Placeholder submit actions must not call unimplemented authentication APIs in Phase 1.
