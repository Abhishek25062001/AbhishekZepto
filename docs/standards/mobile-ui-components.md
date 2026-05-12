# Mobile UI Components

## Purpose

This standard records the required common component foundation for the Customer
App and Delivery Agent App.

## Required Common Components

Both React Native apps should expose these components from
`src/components/common/index.ts`:

```text
Button
Input
Text
ScreenWrapper
Loader
ErrorView
EmptyState
```

## Component Props

`Button` requires:

```text
title
onPress
disabled
loading
variant
size
```

Button variants:

```text
primary
secondary
outline
danger
ghost
```

Button sizes:

```text
sm
md
lg
```

`Input` requires:

```text
label
value
onChangeText
placeholder
error
secureTextEntry
keyboardType
disabled
```

`Text` variants:

```text
h1
h2
h3
body
small
caption
```

`Text` color variants:

```text
primary
secondary
disabled
success
warning
error
```

`ErrorView` requires:

```text
title
message
onRetry
retryLabel
```

`EmptyState` requires:

```text
title
description
actionLabel
onAction
```

## Screen Wrapper Rule

`ScreenWrapper` owns safe area handling, the keyboard avoiding placeholder, default theme spacing, optional scrollable content, and optional background color.

## Usage Rule

Mobile common components should use app theme files from `src/theme` for colors, spacing, radius, and typography.
