# Phase 7 Realtime Event Registry

**Phase:** Phase 7 - Realtime & Live Systems  
**Module:** 16 - Phase 7 Integration & Review

## Socket Namespaces

| Namespace | App Surface | Purpose |
| --- | --- | --- |
| `/customer` | Customer App | Order status, delivery progress, delivery location, in-app notification events. |
| `/delivery` | Delivery Agent App | Assignment events and location sync acknowledgement events. |
| `/vendor` | Vendor Panel | Store order events and pickup visibility events. |
| `/admin` | Admin Dashboard | Control tower order, delivery, SLA, and notification events. |

## Room Names

| Room Format | Used By | Notes |
| --- | --- | --- |
| `customer:{customerId}` | Customer namespace | Joined automatically after customer socket auth. |
| `delivery:{deliveryAgentId}` | Delivery namespace | Joined automatically after delivery-agent socket auth. |
| `vendor:{storeId}` | Vendor namespace | Joined automatically after vendor socket auth. |
| `admin:{adminId}` | Admin namespace | Joined automatically after admin socket auth. |
| `order:{orderId}` | Customer, vendor, admin flows | Customer and vendor joins are ownership checked. |
| `assignment:{assignmentId}` | Delivery flow | Used for delivery assignment room joins. |
| `city:{cityId}` | Admin flow | Super-admin or same-city admin scope is enforced. |

## Socket Events By Namespace

### Customer

- `customer.order_status_updated`
- `customer.order_accepted`
- `customer.order_packed`
- `customer.order_ready_for_pickup`
- `customer.order_out_for_delivery`
- `customer.order_delivered`
- `customer.order_cancelled`
- `customer.delivery_location_updated`
- `customer.delivery_progress_updated`
- `customer.rider_reached_customer`
- `customer.delivery_failed`
- `notification.created`

### Delivery

- `delivery.assignment_created`
- `delivery.assignment_cancelled`
- `delivery.pickup_updated`
- `delivery.delivery_status_updated`
- `delivery.location_sync_acknowledged`
- `delivery.location_sync_rejected`
- `notification.created`

### Vendor

- `vendor.order_created`
- `vendor.order_status_updated`
- `vendor.order_cancelled`
- `vendor.rider_arrived`
- `vendor.pickup_completed`
- `notification.created`

### Admin

- `admin.order_created`
- `admin.order_status_updated`
- `admin.order_delayed`
- `admin.order_cancelled`
- `admin.delivery_assignment_created`
- `admin.delivery_sla_breach_created`
- `admin.delivery_status_changed`
- `admin.delivery_location_updated`
- `admin.delivery_progress_updated`
- `admin.delivery_failed`
- `notification.created`

## Push Notification Payload Types

- Customer delivery status push payloads.
- Delivery assignment push payloads.
- Delivery lifecycle customer push payloads.
- SLA/admin push is not implemented as a Phase 7 mobile push surface.

## In-App Notification Types

- `order_update`
- `delivery_update`
- `assignment_update`
- `payment_update`
- `refund_update`
- `sla_alert`
- `system_alert`

## Missed-Event Replay Event Types

Expected replay event types mirror socket events above and require common fields:

- `eventId`
- `eventName`
- `payload`
- `orderId`
- `assignmentId`
- `updatedAt`

Implementation status: customer replay and acknowledgement are implemented through `GET /api/v1/customer/realtime/missed-events`, `POST /api/v1/customer/realtime/events/:eventId/ack`, and the `realtime_event_logs` persistence collection.
