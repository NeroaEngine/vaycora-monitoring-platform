# Vaycora Asset Operations — Complete Roadmap, Scope, Work Lanes, and Work Trees

## Product Direction

Vaycora Asset Operations is a luxury white-label operations command platform for monitored physical assets.

The platform should support multiple asset lanes without rebuilding the UI/UX:

- OBS monitoring
- Fleet maintenance
- RV monitoring
- Porta-potty fill monitoring
- Container chain of custody
- Livestock / cattle geofencing
- General asset tracking
- Sensor intelligence
- Work orders
- Cost tracking

The product pattern is always:

```txt
Asset
↓
Device / Sensor
↓
Reading / Event
↓
Alert / Review Flag
↓
Work Order / Service Action
↓
Maintenance / Cost Record
↓
Customer/Admin Reporting
```

---

# Core Build Rule

Build every feature as a work lane.

Each lane must have:

1. Visual room
2. Mock data
3. Database schema
4. API/actions
5. Role/security rules
6. Validation
7. Audit trail
8. Empty/loading/error states
9. Hardened workflow
10. Ready-for-customer demo state

Do not build a lane halfway and move on forever. Build the room, then harden the room.

---

# Platform Scope

## In Scope

- Luxury UI/UX shell
- White-label branding layer
- Organizations/customers
- Users and roles
- Assets
- Devices
- Sensors
- Sensor readings
- Device events
- Alerts
- Review flags
- Work orders
- Maintenance records
- Cost records
- OBS module
- Fleet maintenance module
- Porta-potty monitoring module
- Container chain-of-custody module
- Livestock geofence module
- Admin settings
- Reporting dashboards

## Out of Scope for First Version

- Public marketplace
- Bookings
- Payments
- Owner listing approval
- Customer-facing public rental site
- Full dispatch optimization engine
- Native mobile app
- Hardware manufacturing

---

# Physical Architecture

```txt
Frontend: Next.js App Router
UI: Luxury command-center interface with CSS theme variables
Auth: Supabase Auth
Database: Supabase Postgres
Storage: Supabase Storage for logos/photos/documents
Realtime: Supabase Realtime later for live readings/alerts
API: Next.js route handlers / server actions
Hardware ingestion: device-event endpoint and sensor-reading endpoint
White-label: branding_settings per organization
```

---

# Core Data Model

## Foundation Tables

```txt
organizations
profiles
user_roles
branding_settings
audit_log
```

## Asset Tables

```txt
assets
asset_types
asset_events
asset_assignments
asset_documents
asset_photos
```

## Device / Sensor Tables

```txt
devices
device_types
device_events
sensors
sensor_types
sensor_readings
sensor_calibrations
```

## Operations Tables

```txt
alerts
review_flags
work_orders
maintenance_records
cost_records
service_records
notes
```

## Module Tables

```txt
obs_reviews
obs_monitors
porta_potty_units
container_custody_events
container_seals
livestock_animals
livestock_geofences
fleet_vehicles
fleet_service_intervals
```

---

# Work Lanes

## Lane 0 — Luxury UI/UX + White-Label Shell

### Purpose
Lock the premium UI direction so the app does not need another UI rebuild.

### Build Tree

```txt
Lane 0: Luxury Shell
├── App shell
│   ├── top navigation
│   ├── luxury header
│   ├── page frame
│   └── responsive layout
├── Theme system
│   ├── CSS variables
│   ├── luxury default theme
│   ├── operations dark theme
│   └── clean enterprise theme
├── Branding
│   ├── brand name placeholder
│   ├── product name placeholder
│   ├── logo placeholder
│   ├── theme preset selector
│   └── future logo upload
└── Shared components
    ├── cards
    ├── tables
    ├── status pills
    ├── buttons
    ├── empty states
    └── command panels
```

### Harden Tree

```txt
Lane 0 Hardening
├── make all colors variable-based
├── remove hard-coded customer branding from pages
├── responsive mobile/tablet behavior
├── consistent spacing and typography
├── theme persistence
├── theme preview mode
└── accessibility/contrast check
```

### Done When

- The platform feels premium and luxury.
- White-label theme changes do not require page rewrites.
- All future modules inherit the same shell.

---

## Lane 1 — Authentication, Organizations, and Roles

### Purpose
Secure the platform and support customer-specific organizations.

### Build Tree

```txt
Lane 1: Auth + Roles
├── Supabase Auth
│   ├── login
│   ├── logout
│   ├── session loading
│   └── protected routes
├── Organizations
│   ├── organization table
│   ├── org switch context later
│   └── org-level settings
├── Profiles
│   ├── user profile
│   ├── linked organization
│   └── display name/email
└── Roles
    ├── owner
    ├── admin
    ├── manager
    ├── reviewer
    ├── technician
    └── viewer
```

### Harden Tree

```txt
Lane 1 Hardening
├── row-level security
├── role-based route guards
├── admin-only settings
├── org isolation
├── login errors
├── session expiration handling
└── audit login/security actions
```

### Done When

- Users only see their organization.
- Admin routes are protected.
- Role permissions control actions.

---

## Lane 2 — Core Assets

### Purpose
Create the center of the platform: every thing we track is an asset.

### Build Tree

```txt
Lane 2: Assets
├── Asset list
│   ├── search
│   ├── filters
│   ├── status pills
│   └── asset type filter
├── Asset detail
│   ├── overview
│   ├── location
│   ├── status
│   ├── linked devices
│   ├── latest readings
│   ├── open alerts
│   ├── work orders
│   └── cost summary
├── Asset creation
│   ├── asset type
│   ├── serial/tag
│   ├── customer/location
│   └── starting status
└── Asset history
    ├── status changes
    ├── assignment changes
    ├── location changes
    └── audit events
```

### Asset Types

```txt
OBS Monitor
RV
Vehicle
Trailer
Porta-Potty
Container
Cow / Livestock
Equipment
Gateway
Sensor Kit
Other
```

### Harden Tree

```txt
Lane 2 Hardening
├── prevent duplicate asset tags
├── validate asset statuses
├── track status history
├── no hard deletes
├── archived/retired flow
├── empty state
├── loading state
├── error state
└── audit every edit
```

### Done When

- Every module can use the same asset record.
- Assets can be tracked before hardware is finalized.

---

## Lane 3 — Devices and Sensors

### Purpose
Separate physical assets from the devices/sensors attached to them.

### Build Tree

```txt
Lane 3: Devices + Sensors
├── Devices
│   ├── device list
│   ├── device detail
│   ├── device type
│   ├── vendor/model
│   ├── serial/IMEI/ESN
│   ├── SIM/carrier
│   ├── battery status
│   ├── firmware version
│   └── last check-in
├── Sensors
│   ├── sensor list
│   ├── sensor detail
│   ├── sensor type
│   ├── attached asset
│   ├── attached device/gateway
│   ├── calibration values
│   └── last reading
└── Hardware profiles
    ├── Suntech ST6560
    ├── Suntech ST4955
    ├── Suntech ST4345
    ├── Suntech ST4915
    ├── ultrasonic level sensor
    ├── door contact sensor
    ├── geofence tracker
    └── custom programmable sensor
```

### Harden Tree

```txt
Lane 3 Hardening
├── prevent duplicate device serials
├── validate device assignment
├── one active assignment per device
├── track install/uninstall events
├── sensor calibration requirements
├── offline detection
├── stale reading detection
└── audit assignment changes
```

### Done When

- Devices and sensors can be assigned to assets.
- Hardware can change without rebuilding the platform.

---

## Lane 4 — Sensor Readings and Device Events

### Purpose
Create the hardware-agnostic ingestion layer.

### Build Tree

```txt
Lane 4: Readings + Events
├── API endpoints
│   ├── /api/device-events
│   ├── /api/sensor-readings
│   └── /api/heartbeat
├── Reading types
│   ├── location
│   ├── battery_voltage
│   ├── fill_level
│   ├── tank_level
│   ├── door_status
│   ├── generator_status
│   ├── generator_hours
│   ├── temperature
│   ├── motion
│   ├── tilt
│   └── geofence_status
├── Event types
│   ├── check_in
│   ├── offline
│   ├── moved
│   ├── tipped
│   ├── opened
│   ├── closed
│   ├── full
│   ├── near_full
│   ├── outside_geofence
│   └── tamper
└── Normalization
    ├── raw payload
    ├── normalized value
    ├── unit
    ├── confidence
    └── source device
```

### Harden Tree

```txt
Lane 4 Hardening
├── API key/device token validation
├── payload validation
├── reject unknown device IDs
├── store raw payload for debugging
├── normalize reading values
├── deduplicate repeated events
├── timestamp validation
├── rate limiting later
└── audit ingestion errors
```

### Done When

- Mock hardware payloads can create real readings/events.
- Any vendor can feed Vaycora through the same API structure.

---

## Lane 5 — Alerts and Review Flags

### Purpose
Turn readings/events into actions.

### Build Tree

```txt
Lane 5: Alerts + Review Flags
├── Alert rules
│   ├── threshold rules
│   ├── stale/offline rules
│   ├── geofence rules
│   ├── door rules
│   ├── fill-level rules
│   └── maintenance rules
├── Alert queue
│   ├── new
│   ├── acknowledged
│   ├── in review
│   ├── escalated
│   ├── resolved
│   └── dismissed
├── Review flags
│   ├── flag reason
│   ├── priority
│   ├── assigned reviewer
│   ├── notes
│   └── decision history
└── Notifications later
    ├── email
    ├── SMS
    ├── push
    └── webhook
```

### Harden Tree

```txt
Lane 5 Hardening
├── prevent duplicate active alerts
├── require reason when dismissing
├── track status changes
├── escalation rules
├── severity validation
├── reviewer assignment audit
└── alert history preserved
```

### Done When

- Readings create actionable alerts.
- Reviewers can clear, escalate, or convert alerts into work orders.

---

## Lane 6 — Work Orders and Service Actions

### Purpose
Convert alerts and maintenance needs into tracked work.

### Build Tree

```txt
Lane 6: Work Orders
├── Work order list
│   ├── status
│   ├── priority
│   ├── asset
│   ├── customer/location
│   └── assigned user/team
├── Work order detail
│   ├── issue summary
│   ├── linked alert
│   ├── linked asset
│   ├── tasks/checklist
│   ├── notes
│   ├── photos
│   ├── cost entries
│   └── completion proof
├── Statuses
│   ├── Draft
│   ├── Open
│   ├── Assigned
│   ├── In Progress
│   ├── Waiting
│   ├── Completed
│   └── Cancelled
└── Service confirmation
    ├── completed by
    ├── completed at
    ├── GPS proof later
    └── photo proof later
```

### Harden Tree

```txt
Lane 6 Hardening
├── status transition validation
├── require completion notes
├── preserve checklist history
├── link costs to work orders
├── no delete after completion
└── audit all changes
```

### Done When

- Alerts can create work orders.
- Work orders can be completed and stored as history.

---

## Lane 7 — Maintenance and Costs

### Purpose
Track the business side: maintenance, service intervals, and cost history.

### Build Tree

```txt
Lane 7: Maintenance + Costs
├── Maintenance records
│   ├── asset
│   ├── service type
│   ├── date
│   ├── mileage/hours if relevant
│   ├── notes
│   └── next service due
├── Service intervals
│   ├── by time
│   ├── by mileage
│   ├── by engine hours
│   ├── by generator hours
│   └── by usage/fill count
├── Cost records
│   ├── parts
│   ├── labor
│   ├── vendor
│   ├── sensor hardware
│   ├── install
│   ├── monthly cellular
│   └── software allocation
└── Cost dashboard
    ├── asset lifetime cost
    ├── monthly cost
    ├── maintenance cost
    ├── sensor/device cost
    └── profitability later
```

### Harden Tree

```txt
Lane 7 Hardening
├── validate cost category
├── require asset/work order link where needed
├── prevent negative costs unless credit/refund
├── audit edits
├── preserve cost history
└── export-ready structure
```

### Done When

- Every asset can show lifetime maintenance and cost history.
- The program can calculate real hardware + software cost per asset.

---

# Module Lanes

## Lane 8 — OBS Monitoring Module

### Purpose
Keep OBS as one module inside the broader asset operations platform.

### Build Tree

```txt
Lane 8: OBS Module
├── OBS monitors
├── OBS review queue
├── OBS review detail
├── OBS notes
├── OBS statuses
│   ├── New
│   ├── In Review
│   ├── Flagged
│   ├── Cleared
│   ├── Escalated
│   └── Archived
└── OBS linked assets
```

### Harden Tree

```txt
Lane 8 Hardening
├── review status validation
├── reviewer assignment
├── decision history
├── notes audit
├── no hard deletes
└── link review events to assets/devices
```

---

## Lane 9 — Porta-Potty Monitoring Module

### Purpose
Track portable toilet units, fill status, service needs, and dispatch triggers.

### Build Tree

```txt
Lane 9: Porta-Potty Module
├── Units
│   ├── unit ID
│   ├── location
│   ├── customer/site
│   ├── status
│   └── last service
├── Fill sensors
│   ├── ultrasonic reading
│   ├── near full threshold
│   ├── full threshold
│   └── sensor health
├── Alerts
│   ├── near full
│   ├── full
│   ├── tipped over
│   ├── moved
│   └── offline
└── Service actions
    ├── add to route later
    ├── service complete
    ├── photo proof later
    └── reset fill status
```

### Harden Tree

```txt
Lane 9 Hardening
├── calibrate sensor per unit
├── avoid false full alerts
├── require service completion proof
├── track service history
├── preserve fill history
└── turn full alert into work order
```

---

## Lane 10 — Container Chain of Custody Module

### Purpose
Provide end-to-end proof of container custody, door activity, seal status, and location.

### Build Tree

```txt
Lane 10: Chain of Custody
├── Container assets
├── Door sensor status
├── Seal IDs
├── Custody events
│   ├── assigned
│   ├── loaded
│   ├── sealed
│   ├── picked up
│   ├── in transit
│   ├── arrived
│   ├── door opened
│   ├── unloaded
│   └── custody complete
├── Exceptions
│   ├── door opened outside geofence
│   ├── moved after seal
│   ├── seal mismatch
│   ├── after-hours open
│   └── tracker offline
└── Proof
    ├── user
    ├── timestamp
    ├── GPS
    ├── photo later
    └── document upload later
```

### Harden Tree

```txt
Lane 10 Hardening
├── immutable custody timeline
├── seal change audit
├── door event validation
├── exception handling
├── completion lock
└── exportable custody report
```

---

## Lane 11 — Livestock / Cattle Geofence Module

### Purpose
Track cattle location, pasture geofence status, escape alerts, and movement/inactivity events.

### Build Tree

```txt
Lane 11: Livestock Module
├── Animal records
│   ├── cow ID
│   ├── tag number
│   ├── tracker ID
│   ├── owner/ranch
│   └── status
├── Geofences
│   ├── pasture name
│   ├── radius
│   ├── polygon later
│   └── assigned animals
├── Location readings
│   ├── last location
│   ├── last check-in
│   ├── battery
│   └── movement state
└── Alerts
    ├── outside radius
    ├── no movement
    ├── tracker offline
    ├── low battery
    └── possible escape
```

### Harden Tree

```txt
Lane 11 Hardening
├── avoid GPS drift false alarms
├── require consecutive outside readings
├── alert only after threshold
├── battery/report interval rules
├── geofence history
└── audit tracker assignment
```

---

## Lane 12 — Fleet Maintenance Module

### Purpose
Build fleet maintenance without making the whole product only fleet.

### Build Tree

```txt
Lane 12: Fleet Maintenance
├── Fleet vehicles
├── Vehicle detail
├── Mileage/engine hours
├── Service intervals
├── Maintenance records
├── Repairs
├── Parts
├── Costs
├── Documents/photos
└── Future route/dispatch link
```

### Harden Tree

```txt
Lane 12 Hardening
├── VIN/asset duplicate prevention
├── service interval validation
├── maintenance due alerts
├── cost link to work orders
├── records locked after completion if needed
└── audit all edits
```

---

## Lane 13 — RV Monitoring Module

### Purpose
Support RV OBS and sensor monitoring once hardware choices are confirmed.

### Build Tree

```txt
Lane 13: RV Monitoring
├── RV asset profile
├── Standard OBS data
│   ├── GPS
│   ├── VIN
│   ├── ignition
│   ├── mileage
│   ├── speed
│   ├── RPM
│   └── engine hours
├── Extended sensors
│   ├── fresh water
│   ├── gray water
│   ├── black water
│   ├── propane
│   ├── generator status
│   ├── generator hours
│   └── house battery
└── Alerts
    ├── tank low/full
    ├── propane low
    ├── generator runtime
    ├── battery low
    └── offline
```

### Harden Tree

```txt
Lane 13 Hardening
├── sensor calibration
├── reading confidence
├── stale sensor alerts
├── hardware source tracking
├── avoid vendor lock-in
└── hardware profile validation
```

---

# Sprint Plan

## Sprint 1 — Lock Luxury Shell + Core Architecture

- [x] Luxury UI direction
- [x] White-label documentation
- [ ] Update all pages to luxury layout
- [ ] Create shared layout components
- [ ] Add empty/loading/error components
- [ ] Add module-ready navigation

## Sprint 2 — Supabase Foundation

- [ ] Supabase project setup
- [ ] Auth wiring
- [ ] organizations
- [ ] profiles
- [ ] roles
- [ ] branding_settings
- [ ] audit_log
- [ ] RLS policies

## Sprint 3 — Core Assets + Devices

- [ ] assets table
- [ ] devices table
- [ ] sensors table
- [ ] asset list connected
- [ ] asset detail page
- [ ] device detail page
- [ ] sensor assignment workflow

## Sprint 4 — Readings + Alerts

- [ ] sensor_readings table
- [ ] device_events table
- [ ] /api/sensor-readings
- [ ] /api/device-events
- [ ] alerts table
- [ ] review_flags table
- [ ] alert queue
- [ ] alert rule placeholders

## Sprint 5 — Work Orders + Costs

- [ ] work_orders table
- [ ] work order list/detail
- [ ] create work order from alert
- [ ] maintenance_records table
- [ ] cost_records table
- [ ] cost dashboard placeholder

## Sprint 6 — OBS Module Harden

- [ ] obs_monitors
- [ ] obs_reviews
- [ ] OBS queue connected
- [ ] OBS review detail
- [ ] status changes
- [ ] notes
- [ ] decision history

## Sprint 7 — First Expansion Module

Choose one:

```txt
Option A: Porta-potty fill monitoring
Option B: Container chain of custody
Option C: Fleet maintenance
Option D: Livestock geofence
```

Recommended first expansion after core: Container chain of custody or porta-potty fill monitoring, because the sensor logic is simpler than RV tanks.

---

# Build Order Recommendation

Do not build modules before the foundation.

Best order:

```txt
1. Luxury shell
2. Auth/orgs/roles
3. Assets
4. Devices/sensors
5. Readings/events
6. Alerts/review flags
7. Work orders
8. Costs/maintenance
9. OBS module hardening
10. Porta-potty/container/cattle/fleet modules
```

---

# Definition of Done Per Lane

A lane is done only when it has:

- UI page/room
- Mock state
- Database schema
- Real data connection
- Create/edit workflow where needed
- Role protection
- Validation
- Audit trail
- Empty/loading/error states
- Responsive layout
- No hard deletes unless explicitly allowed
- Customer-demo ready flow

---

# Current Status

## Built

- Next.js app foundation
- Luxury UI direction
- Global theme variables
- Top navigation shell
- Dashboard visual skeleton
- Login placeholder
- Assets placeholder
- OBS review placeholder
- Admin/branding placeholder
- Theme switcher
- White-label documentation

## Not Built Yet

- Real auth
- Supabase schema
- Organizations
- Real asset data
- Device/sensor data
- Ingestion APIs
- Alerts
- Work orders
- Costs
- Module-specific workflows

---

# Final Scope Statement

Vaycora should be built as a luxury white-label Asset Operations platform.

OBS monitoring is one module.
Fleet maintenance is one module.
Porta-potty monitoring is one module.
Container chain of custody is one module.
Livestock geofencing is one module.
RV monitoring is one module.

The foundation is shared: assets, devices, sensors, readings, alerts, work orders, maintenance, costs, and admin branding.
