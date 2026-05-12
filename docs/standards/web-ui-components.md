# Web UI Components

## Scope

This standard applies to common Phase 1 React web panel components shared by the Vendor Panel and Admin Dashboard.

## Required Components

- `Button`: supports children, disabled state, native button props, and a loading state.
- `Input`: supports label, value, placeholder, type, change handler, disabled state, and error text.
- `Card`: supports title, description, children, and footer.
- `Table`: supports column definitions, row data, row key, custom cell rendering, loading state, and an empty message.
- `Modal`: supports open state, title, children, footer, close button, and close handler.
- `Loader`: renders inline and page loading placeholders.
- `ErrorView`: renders an error title, message, retry handler, and retry label.
- `EmptyState`: renders an empty-state title, description, action label, and action handler.
- `Badge`: renders status labels with success, warning, error, info, and neutral variants.

## Button Variants

- `primary`
- `secondary`
- `outline`
- `danger`
- `ghost`

## Button Sizes

- `sm`
- `md`
- `lg`

## Badge Variants

- `success`
- `warning`
- `error`
- `info`
- `neutral`

## Usage Rules

- Common components must stay presentation-focused.
- Feature-specific API calls and business logic must remain in feature pages, hooks, stores, or services.
- Vendor Panel and Admin Dashboard may evolve styling independently after this foundation, but the component names stay aligned.
