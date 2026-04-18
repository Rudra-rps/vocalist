# Arduino IDE Guide

## What To Use Right Now

Use [smart_dj.ino](/C:/Users/2005r/Downloads/DJ_Booth/vocalist/firmware/integrated/smart_dj.ino) as the main project sketch in Arduino IDE.

This sketch already includes:

- full booth state logic
- sound smoothing
- structured serial output
- built-in demo fallback mode
- 5 demo variations

Because your hardware is not working right now, the sketch is currently set to start in demo mode by default.

## Arduino IDE Setup

1. Open Arduino IDE.
2. Install ESP32 board support if not already installed.
3. Open [smart_dj.ino](/C:/Users/2005r/Downloads/DJ_Booth/vocalist/firmware/integrated/smart_dj.ino).
4. Install the `Adafruit VL53L0X` library from Library Manager.
5. Select your ESP32 board from `Tools > Board`.
6. Select the correct COM port from `Tools > Port`.
7. Click Upload.

## What You Will See

Open Serial Monitor and set:

- baud rate: `115200`
- line ending: `Newline`

On boot, the sketch will print frames like:

```text
distance=260,sound=835,density=89,state=GOOD,mode=DEMO,scenario=peak_hour,tick=0
```

## Demo Commands

Type these into Serial Monitor and press send:

- `status`
- `next`
- `demo`
- `live`
- `scenario 1`
- `scenario 2`
- `scenario 3`
- `scenario 4`
- `scenario 5`

## Scenario Meanings

1. `scenario 1` -> `warmup_room`
2. `scenario 2` -> `crowd_surge`
3. `scenario 3` -> `peak_hour`
4. `scenario 4` -> `too_loud_alert`
5. `scenario 5` -> `late_night_dip`

## When Hardware Starts Working

Edit this line in [smart_dj.ino](/C:/Users/2005r/Downloads/DJ_Booth/vocalist/firmware/integrated/smart_dj.ino):

```cpp
static const bool FORCE_DEMO_MODE = true;
```

Change it to:

```cpp
static const bool FORCE_DEMO_MODE = false;
```

Then upload again. The sketch will try live sensor mode first and fall back to demo mode if the VL53L0X still does not initialize.

## Recommended Demo Path For You

1. Upload `smart_dj.ino`
2. Open Serial Monitor
3. Start with `scenario 1`
4. Type `next` every few seconds to move through the demo story
5. Explain that the same sketch supports live mode once the hardware layer is fixed
