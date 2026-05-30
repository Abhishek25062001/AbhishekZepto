# Phase 7 Manual QA Checklist

**Phase:** Phase 7 - Realtime & Live Systems  
**Module:** 16 - Phase 7 Integration & Review

## Customer App Realtime

- Confirm socket connects to `/customer` after login.
- Confirm active order room is restored after reconnect.
- Confirm delivery location updates render without manual refresh.
- Confirm polling delivery tracker remains usable if socket disconnects.
- Confirm stale delivery location updates do not replace newer state.

## Delivery Agent App Realtime

- Confirm socket connects to `/delivery` after login.
- Confirm active assignment room is restored after reconnect.
- Confirm new assignment alert appears for assignment events.
- Confirm location sync acknowledgement updates local state.
- Confirm assignment polling remains usable if socket disconnects.

## Vendor Panel Realtime

- Confirm socket connects to `/vendor` after login.
- Confirm active order rooms are restored after reconnect.
- Confirm new order and rider-arrived events update order views.
- Confirm pickup completion updates live visibility.
- Confirm order/pickup polling remains usable if socket disconnects.

## Admin Dashboard Realtime

- Confirm socket connects to `/admin` after login.
- Confirm city rooms are restored after reconnect.
- Confirm live order metrics update from realtime events.
- Confirm delivery locations update without page refresh.
- Confirm SLA breach panel updates live.
- Confirm control tower snapshot fallback works during socket disconnect.

## Push Notifications

- Register customer device token and verify masked token appears in logs.
- Trigger customer delivery out-for-delivery flow.
- Open app from customer push and verify navigation to tracking screen.
- Register delivery-agent device token.
- Trigger delivery assignment push and verify navigation to active assignment.

## Notification Center

- Confirm notification bell placement is consistent for each app surface.
- Confirm unread badge increments when `notification.created` is received.
- Confirm notification item spacing, timestamps, and priority indicators.
- Confirm empty state renders when no notifications exist.
- Confirm mark-read updates unread count.
- Confirm mark-all-read clears unread state where supported.

