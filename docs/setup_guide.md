# Setup Guide

## Current Recommended Path

Because the hardware is not working right now, use the desktop demo backend first.

## Run Demo Mode

From the repo root:

```powershell
python backend/run_demo.py --list
python backend/run_demo.py --scenario peak_hour --ticks 20
```

Optional JSON output:

```powershell
python backend/run_demo.py --scenario too_loud_alert --json
```

## When Hardware Is Ready

Upload these sketches in order:

1. `firmware/sensor_test/vl53l0x_test.ino`
2. `firmware/sensor_test/mic_test.ino`
3. `firmware/integrated/smart_dj.ino`

## Serial Commands In Integrated Firmware

The integrated ESP32 sketch is designed to support these commands from Serial Monitor:

- `status`
- `demo`
- `live`
- `next`
- `scenario 1`
- `scenario 2`
- `scenario 3`
- `scenario 4`
- `scenario 5`

These commands are useful when the demo needs to keep moving even if sensors fail at boot.

