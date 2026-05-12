# Mobile Theme Usage

## Goal

Customer App and Delivery Agent App components must use local app theme files that match the shared design token foundation.

## Import Rule

Mobile components must import colors, spacing, radius, and typography from `src/theme`.

## Color Rule

Hardcoded colors are not allowed inside screen files. Use `colors` from `src/theme` instead.

## Spacing Rule

Hardcoded spacing values are allowed only for one-off layout exceptions. Reusable components should use `spacing` from `src/theme`.

## Radius And Typography Rule

Reusable mobile components should use `radius` and `typography` from `src/theme`.
