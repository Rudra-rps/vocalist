# Smart DJ Booth Plan

## Goal

Build a client-facing Smart DJ Booth demo that can still run convincingly while the hardware layer is unavailable.

## Current Direction

The project now has two clear tracks:

1. `Backend + demo fallback`
2. `Hardware integration later`

This lets the project remain presentable right now instead of waiting on the sensor setup.

## Deliverables

### Core Backend

- shared state engine for density and sound processing
- structured output format for future dashboard work
- tunable thresholds
- smoothing for noisy sound input

### Firmware

- sensor test sketch for `VL53L0X`
- sensor test sketch for `INMP441`
- integrated ESP32 sketch
- automatic demo fallback when hardware is unavailable

### Demo Mode

- at least five realistic scenarios
- desktop runner for no-hardware demos
- serial-compatible output for future dashboard integration

### Docs

- architecture document
- setup guide
- demo script
- polished README

## Definition of Done

The current phase is complete when:

- the backend can be demoed without sensors
- the ESP32 sketch can fall back to demo mode
- there are multiple scenario variations for presentation
- the output format is stable enough to plug into a dashboard later
