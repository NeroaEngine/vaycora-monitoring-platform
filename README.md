# Vaycora Monitoring Platform / VCore Recorder

VCore is the source-of-truth dashboard for Vaycora Hardwear assets, devices, sensor readings, install state, service alerts, field notes, and the next-action queue.

## Current dashboard state

This repo now runs the VCore Recorder MVP v0.2 dashboard.

Included:

- Asset registry for RV, porta-potty, cattle, and general tracked assets
- Selected-asset detail panel with sensor readings and field notes
- Local browser persistence for dashboard edits
- Add/edit asset form
- Next-action queue per asset
- Install status and priority fields
- Buy/install tracker for the initial sensor stack
- Open work queue for the next production tasks

## Run locally

```bash
npm install
npm run dev
```

## Next production work

1. Add Supabase tables for assets, devices, sensors, readings, alerts, field notes, install events, service events, and parts.
2. Replace local storage with authenticated database persistence.
3. Add ingestion endpoints for Suntech and sensor payloads.
4. Turn porta-potty fill level and tip-over into the first live alert lane.
