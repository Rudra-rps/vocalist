# VS Code Setup

## Recommended Path

Use `VS Code + PlatformIO` for this project.

Why:

- better ESP32 support than the older Arduino extension
- easier library management
- easier serial monitor and environment switching
- works well with multiple sketches in one repo

## One-Time Setup

1. Install [VS Code](https://code.visualstudio.com/).
2. Open the folder [vocalist](C:/Users/2005r/Downloads/DJ_Booth/vocalist) in VS Code.
3. Install the `PlatformIO IDE` extension.
4. Let PlatformIO finish installing its toolchains the first time it opens.

## Project Files Already Added

This repo now includes:

- [platformio.ini](C:/Users/2005r/Downloads/DJ_Booth/vocalist/platformio.ini)
- [.vscode/extensions.json](C:/Users/2005r/Downloads/DJ_Booth/vocalist/.vscode/extensions.json)

## Available Build Targets

The PlatformIO environments are:

- `smart_dj`
- `vl53l0x_test`
- `mic_test`

## If Your ESP32 Board Is Generic

The current config uses:

```ini
board = esp32dev
```

If your exact ESP32 board is different, change the `board` value in [platformio.ini](C:/Users/2005r/Downloads/DJ_Booth/vocalist/platformio.ini).

Examples:

- `esp32dev`
- `nodemcu-32s`
- `wemos_d1_mini32`

## How To Build And Upload

### Smart DJ Demo Firmware

This is the main one for you right now:

- file: [smart_dj.ino](C:/Users/2005r/Downloads/DJ_Booth/vocalist/firmware/integrated/smart_dj.ino)
- env: `smart_dj`

Steps:

1. Open PlatformIO sidebar.
2. Under `PROJECT TASKS`, open `smart_dj`.
3. Click `Build`.
4. Connect ESP32.
5. Click `Upload`.
6. Click `Monitor`.

## Sensor Test Uploads

### VL53L0X Test

Use env `vl53l0x_test`.

### INMP441 Test

Use env `mic_test`.

## Serial Monitor Settings

Use:

- baud: `115200`

In the integrated sketch, demo commands include:

- `status`
- `next`
- `demo`
- `live`
- `scenario 1`
- `scenario 2`
- `scenario 3`
- `scenario 4`
- `scenario 5`

## What To Do Right Now

Because your hardware is not working yet:

1. Build and upload `smart_dj`
2. Keep demo mode enabled in [smart_dj.ino](C:/Users/2005r/Downloads/DJ_Booth/vocalist/firmware/integrated/smart_dj.ino)
3. Open Serial Monitor
4. Drive the demo using scenario commands

## When Hardware Starts Working

In [smart_dj.ino](C:/Users/2005r/Downloads/DJ_Booth/vocalist/firmware/integrated/smart_dj.ino), change:

```cpp
static const bool FORCE_DEMO_MODE = true;
```

to:

```cpp
static const bool FORCE_DEMO_MODE = false;
```

Then rebuild and upload `smart_dj`.

## If Upload Fails

Most likely causes:

- bad USB cable
- wrong COM port
- missing driver
- board in boot mode issue

These problems affect both Arduino IDE and VS Code, because both use the same USB connection underneath.
