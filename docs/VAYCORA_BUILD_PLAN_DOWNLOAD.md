# Vaycora Asset Operations — Downloadable Build Plan

## Build Decision

We are building **Vaycora Asset Operations** as a luxury white-label operations command platform.

OBS monitoring is one module inside the platform, not the entire platform.

The foundation will support:

- OBS monitor review
- Fleet maintenance
- RV monitoring
- Porta-potty fill monitoring
- Container chain of custody
- Livestock / cattle geofencing
- General asset tracking
- Sensor intelligence
- Alerts
- Work orders
- Maintenance
- Costs

---

# First Lane We Work On

## Lane 0 — Luxury UI/UX + White-Label Brand Shell

This is the first lane because the UI/UX direction must be locked before we build the rest of the rooms.

### Goal

Build and harden the luxury shell so every future module uses the same premium command-center layout.

### Build Tree

```txt
Lane 0: Luxury Brand Shell
├── Luxury app shell
│   ├── top navigation
│   ├── executive dashboard layout
│   ├── premium cards
│   ├── luxury tables
│   ├── status pills
│   └── responsive layout
│
├── Hard-coded Vaycora logo layer
│   ├── Vaycora default logo/brand mark
│   ├── Vaycora Asset Operations product name
│   ├── default brand fallback
│   └── customer-facing logo control later
│
├── White-label color controls
│   ├── color preset dropdown
│   ├── primary color dropdown
│   ├── accent color dropdown
│   ├── background color dropdown
│   ├── surface/card color dropdown
│   └── text style preset dropdown
│
├── Theme presets
│   ├── Luxury Command
│   ├── Operations Dark
│   ├── Clean Enterprise
│   └── Custom Customer Theme later
│
└── Branding admin room
    ├── preview current theme
    ├── change preset from dropdown
    ├── change colors from dropdowns
    ├── save locally first
    └── save to Supabase later
```

### Harden Tree

```txt
Lane 0 Hardening
├── keep Vaycora logo hard-coded as default
├── do not hard-code customer colors into pages
├── all UI colors must use CSS variables
├── color dropdowns update CSS variables
├── theme choice persists locally first
├── theme choice later saves to Supabase branding_settings
├── mobile/tablet layout works
├── luxury dashboard, assets, OBS reviews, admin, and branding pages match
├── empty/loading/error components match luxury style
└── no future module should require UI/UX rebuild
```

### Done When

- The UI feels luxury and premium.
- The Vaycora logo/brand is the hard-coded default.
- Admin can change color direction from dropdown controls.
- All existing rooms match the luxury style.
- Future modules can be added without redesigning the app.

---

# Brand and White-Label Rules

## Logo Rule

The **Vaycora logo/brand mark stays hard-coded as the default brand identity.**

That means the platform always has a Vaycora-owned default look.

Later, customer white-label branding can be added on top of that as an admin-controlled setting.

```txt
Default: Vaycora Asset Operations
Later: Customer-branded portal option
```

## Color Rule

Colors should not be hard-coded into individual pages.

All colors should use CSS variables:

```txt
--color-primary
--color-primary-deep
--color-accent
--color-gold
--color-background
--color-surface
--color-surface-2
--color-text
--color-muted
--color-border
--color-soft
```

## Dropdown Color Controls

The branding/admin room should include dropdown controls for:

```txt
Theme preset
Primary color
Accent color
Background style
Card/surface style
Text contrast style
```

Example dropdown choices:

```txt
Theme Preset:
- Luxury Command
- Operations Dark
- Clean Enterprise
- Customer Custom

Primary Color:
- Vaycora Deep Green
- Midnight Green
- Charcoal Black
- Navy Executive

Accent Color:
- Vaycora Orange
- Burnished Gold
- Copper
- Safety Amber

Background Style:
- Luxury Dark
- Warm Cream
- Clean Light
- High Contrast Dark
```

---

# Full Build Order

```txt
1. Lane 0 — Luxury UI/UX + White-Label Brand Shell
2. Lane 1 — Auth, Organizations, and Roles
3. Lane 2 — Core Assets
4. Lane 3 — Devices and Sensors
5. Lane 4 — Sensor Readings and Device Events
6. Lane 5 — Alerts and Review Flags
7. Lane 6 — Work Orders and Service Actions
8. Lane 7 — Maintenance and Costs
9. Lane 8 — OBS Monitoring Module
10. Lane 9 — Porta-Potty Fill Monitoring Module
11. Lane 10 — Container Chain of Custody Module
12. Lane 11 — Livestock / Cattle Geofence Module
13. Lane 12 — Fleet Maintenance Module
14. Lane 13 — RV Monitoring Module
```

---

# Lane 1 — Auth, Organizations, and Roles

## Build Tree

```txt
Lane 1: Auth + Organizations
├── Supabase Auth
├── protected routes
├── organizations table
├── profiles table
├── roles
│   ├── owner
│   ├── admin
│   ├── manager
│   ├── reviewer
│   ├── technician
│   └── viewer
└── organization-specific branding connection
```

## Harden Tree

```txt
Lane 1 Hardening
├── row-level security
├── admin-only routes
├── role-based permissions
├── org isolation
├── login error states
├── session handling
└── audit security events
```

---

# Lane 2 — Core Assets

## Build Tree

```txt
Lane 2: Assets
├── asset list
├── asset detail
├── asset creation
├── asset status
├── asset type
├── location
├── linked devices
├── linked sensors
├── latest readings
├── open alerts
├── work orders
└── cost summary
```

## Asset Types

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

## Harden Tree

```txt
Lane 2 Hardening
├── duplicate asset prevention
├── asset status validation
├── status history
├── no hard deletes
├── archive/retire flow
├── empty states
├── loading states
├── error states
└── audit every asset change
```

---

# Lane 3 — Devices and Sensors

## Build Tree

```txt
Lane 3: Devices + Sensors
├── device list
├── device detail
├── vendor/model
├── serial/IMEI/ESN
├── SIM/carrier
├── battery status
├── firmware version
├── last check-in
├── sensor list
├── sensor detail
├── sensor type
├── calibration values
└── sensor assignment workflow
```

## Harden Tree

```txt
Lane 3 Hardening
├── duplicate serial prevention
├── assignment validation
├── one active assignment per device
├── install/uninstall history
├── sensor calibration requirements
├── offline detection
├── stale reading detection
└── audit assignment changes
```

---

# Lane 4 — Readings and Events

## Build Tree

```txt
Lane 4: Hardware-Agnostic Ingestion
├── /api/device-events
├── /api/sensor-readings
├── /api/heartbeat
├── raw payload storage
├── normalized readings
├── source device
├── reading value
├── unit
├── confidence
└── timestamp
```

## Harden Tree

```txt
Lane 4 Hardening
├── API key/device token validation
├── payload validation
├── reject unknown devices
├── deduplicate repeated events
├── timestamp validation
├── rate limiting later
└── audit ingestion errors
```

---

# Lane 5 — Alerts and Review Flags

## Build Tree

```txt
Lane 5: Alerts + Reviews
├── alert rules
├── threshold rules
├── stale/offline rules
├── geofence rules
├── door rules
├── fill-level rules
├── alert queue
├── review flags
├── priority
├── notes
└── decision history
```

## Harden Tree

```txt
Lane 5 Hardening
├── duplicate active alert prevention
├── require dismiss reason
├── status change audit
├── escalation rules
├── severity validation
└── preserve alert history
```

---

# Lane 6 — Work Orders

## Build Tree

```txt
Lane 6: Work Orders
├── work order list
├── work order detail
├── linked alert
├── linked asset
├── assigned user/team
├── tasks/checklist
├── notes
├── photos later
├── cost entries
└── completion proof
```

## Harden Tree

```txt
Lane 6 Hardening
├── status validation
├── completion requirements
├── checklist history
├── cost links
├── no deletion after completion
└── audit changes
```

---

# Lane 7 — Maintenance and Costs

## Build Tree

```txt
Lane 7: Maintenance + Costs
├── maintenance records
├── service intervals
├── parts
├── labor
├── vendors
├── hardware cost
├── install cost
├── monthly cellular cost
├── software allocation cost
└── asset lifetime cost
```

## Harden Tree

```txt
Lane 7 Hardening
├── cost category validation
├── asset/work order link required where needed
├── no negative costs unless credit/refund
├── cost edit audit
├── preserved history
└── export-ready structure
```

---

# Module Lanes

## OBS Module

```txt
OBS monitors
OBS review queue
OBS review detail
OBS notes
OBS statuses
OBS linked assets
Decision history
```

## Porta-Potty Module

```txt
Units
Ultrasonic fill sensors
Near full threshold
Full threshold
Service needed alerts
Tipped/moved/offline alerts
Service completion
```

## Container Chain of Custody Module

```txt
Container assets
Door status
Seal IDs
Custody events
Door opened exception
Moved after seal exception
Exportable custody report
```

## Livestock / Cattle Module

```txt
Animal records
Tracker assignment
Pasture geofence
Location readings
Outside radius alerts
Low battery alerts
GPS drift protection
```

## Fleet Maintenance Module

```txt
Vehicles
Mileage / engine hours
Service intervals
Maintenance records
Repairs
Parts
Costs
Documents/photos
```

## RV Monitoring Module

```txt
OBD vehicle data
GPS
VIN
Mileage
Engine hours
Fresh water
Gray water
Black water
Propane
Generator status
Generator hours
House battery
```

---

# Definition of Done for Every Lane

A lane is complete only when it has:

- UI room
- Mock data
- Database schema
- Real data connection
- Create/edit workflow where needed
- Role protection
- Validation
- Audit trail
- Empty/loading/error states
- Responsive layout
- No hard deletes unless allowed
- Customer-demo ready workflow

---

# Immediate Next Step

Start with **Lane 0 hardening**.

Concrete next build tasks:

```txt
1. Update all current pages to match the luxury UI.
2. Replace branding page with real dropdown color controls.
3. Keep Vaycora logo/brand hard-coded as the default.
4. Make dropdowns control CSS variables locally.
5. Create the future Supabase branding_settings shape.
6. Add reusable luxury components for future lanes.
```

After Lane 0 is hardened, move to **Lane 1: Auth, Organizations, and Roles**.
