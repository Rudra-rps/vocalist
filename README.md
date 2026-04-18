# Smart DJ Booth

Smart DJ Booth is an ESP32-based crowd feedback system designed for demo-friendly, real-time booth intelligence. It combines crowd proximity and sound energy into a simple state engine that can tell a story live: when the room is calm, building, hyped, or simply too loud.

This repo is intentionally built to support two modes:

- `Live hardware mode` for the real ESP32 + VL53L0X + INMP441 setup
- `Demo fallback mode` for presentations when hardware is unavailable or unstable

For the current phase, Arduino IDE is the main path. The integrated ESP32 sketch is ready to run in demo mode even before the sensors are fixed.

## What It Does

- Reads crowd proximity from `VL53L0X`
- Reads sound energy from `INMP441`
- Calculates a density score from distance
- Smooths noisy values
- Classifies the environment into:
  - `LOW`
  - `GOOD`
  - `HYPE`
  - `TOO LOUD`
- Emits structured output that a future dashboard can consume

## Why Demo Mode Exists

The project currently needs to remain demoable even when sensors or USB connectivity are not working. For that reason, the codebase includes a complete fallback backend and an ESP32-side demo mode with multiple scenarios.

## Repo Structure

```text
smart-dj-booth/
├── backend/
│   ├── __init__.py
│   ├── demo_mode.py
│   ├── run_demo.py
│   └── smart_dj_engine.py
├── docs/
│   ├── architecture.md
│   ├── demo_script.md
│   └── setup_guide.md
├── firmware/
│   ├── integrated/
│   │   └── smart_dj.ino
│   └── sensor_test/
│       ├── mic_test.ino
│       └── vl53l0x_test.ino
├── hardware/
│   └── components.md
├── LICENSE
└── README.md
```

## Quick Start

### VS Code + PlatformIO

If you want to work fully in VS Code, use:

- [platformio.ini](C:/Users/2005r/Downloads/DJ_Booth/vocalist/platformio.ini)
- [docs/vscode_setup.md](C:/Users/2005r/Downloads/DJ_Booth/vocalist/docs/vscode_setup.md)

PlatformIO environments included:

- `smart_dj`
- `vl53l0x_test`
- `mic_test`

### ESP32 Firmware

For Arduino IDE, start with:

- [firmware/integrated/smart_dj.ino](/C:/Users/2005r/Downloads/DJ_Booth/vocalist/firmware/integrated/smart_dj.ino)

Then follow:

- [docs/arduino_ide_guide.md](/C:/Users/2005r/Downloads/DJ_Booth/vocalist/docs/arduino_ide_guide.md)
- [docs/vscode_setup.md](C:/Users/2005r/Downloads/DJ_Booth/vocalist/docs/vscode_setup.md)

When hardware testing is ready, also use:

- `firmware/sensor_test/vl53l0x_test.ino`
- `firmware/sensor_test/mic_test.ino`

The integrated sketch supports:

- forced demo mode
- automatic fallback when the VL53L0X is not detected
- serial commands to change scenarios

## Demo Scenarios

The fallback system currently includes five variations:

1. `warmup_room`
2. `crowd_surge`
3. `peak_hour`
4. `too_loud_alert`
5. `late_night_dip`

Each scenario generates different distance and sound behavior so the system looks alive and believable during a demo.

## Output Format

Both firmware and desktop simulation are designed around a shared structured payload:

```text
distance=220,sound=1180,density=73,state=GOOD,mode=DEMO,scenario=peak_hour
```

That keeps the future dashboard simple because it only needs one parser.

## Current Status

- Arduino IDE integrated firmware with fallback logic: included
- 5 built-in ESP32 demo scenarios: included
- Desktop backend helper path: included
- Dashboard: intentionally postponed
- Hardware bring-up: pending sensor/USB fix

## Next Step

Use the Arduino IDE sketch now in demo mode to validate the story, state logic, and serial output. Once the hardware is stable, switch the same sketch to live mode without changing the project narrative.
