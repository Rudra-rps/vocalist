# Architecture

## Overview

Smart DJ Booth is split into two execution paths that share the same decision model:

1. `Live hardware path`
2. `Demo fallback path`

This keeps the project demoable even when the physical system is unavailable.

## Live Hardware Path

```text
VL53L0X + INMP441 -> ESP32 -> smoothing + state engine -> serial output
```

Responsibilities:

- read live distance from the ToF sensor
- read live sound samples from the I2S microphone
- normalize and smooth values
- compute `LOW`, `GOOD`, `HYPE`, or `TOO LOUD`
- emit a structured serial line

## Demo Fallback Path

```text
Scenario generator -> shared logic engine -> serial/JSON output
```

Responsibilities:

- simulate realistic crowd distance changes
- simulate music/energy changes
- reuse the same state logic as the live system
- provide a no-hardware fallback for demos and future dashboard work

## Shared Output Contract

Both paths should produce the same logical fields:

```text
distance=220,sound=1180,density=73,state=GOOD,mode=DEMO,scenario=peak_hour,tick=12
```

That gives the future dashboard one consistent input shape.

## Design Goals

- work without WiFi
- stay presentable during hardware failures
- make future dashboard integration easy
- keep threshold tuning centralized and understandable

