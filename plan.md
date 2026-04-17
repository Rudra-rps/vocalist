# Smart DJ Booth Plan

## Goal

Build an ESP32-based Smart DJ Booth that uses only the currently available hardware:

- ESP32
- VL53L0X distance sensor
- INMP441 microphone

The system should measure crowd proximity and sound level in real time, process both values on the ESP32, and display the current booth state through serial output and a simple dashboard running over USB serial on a connected laptop.

## Scope

Included in this version:

- ESP32 firmware
- VL53L0X distance sensing
- INMP441 sound level sensing
- Real-time state logic
- Serial monitor output
- Simple laptop dashboard using serial data

Not included in this version:

- WiFi features
- Web dashboard
- LED strip effects
- Extra sensors not already available

## System Overview

Sensors -> ESP32 -> Processing Logic -> Serial Output + USB Dashboard

### Inputs

- `VL53L0X`: estimate crowd density by measuring distance
- `INMP441`: estimate crowd energy by measuring sound level

### Outputs

- Arduino Serial Monitor for raw testing
- Simple serial dashboard on laptop for demo display

## Project Objectives

1. Make the ESP32 connect and upload reliably.
2. Test both sensors independently.
3. Combine both sensors into one integrated sketch.
4. Classify the environment into simple booth states.
5. Show live values in a basic dashboard without WiFi.

## Phases

### Phase 1: Hardware Bring-Up

Purpose:
Ensure the ESP32 can be programmed and the sensors are wired cleanly.

Tasks:

- Fix the USB cable / COM port issue
- Confirm ESP32 is detected by the Arduino IDE
- Wire `VL53L0X` correctly over I2C
- Wire `INMP441` correctly over I2S
- Label and document the final pin connections

Deliverables:

- Stable USB connection
- Confirmed COM port
- Working wiring map

Success criteria:

- ESP32 code uploads without port errors
- Board powers on consistently

### Phase 2: Sensor Validation

Purpose:
Verify that each sensor works on its own before integration.

Tasks:

- Create and run `vl53l0x_test.ino`
- Print distance values in millimeters
- Create and run `mic_test.ino`
- Print microphone amplitude or averaged sound level values
- Check readings for stability and obvious noise issues

Deliverables:

- Independent test sketch for distance sensor
- Independent test sketch for microphone
- Verified serial output for both sensors

Success criteria:

- Distance output updates in real time
- Sound level output changes when clapping or speaking nearby

### Phase 3: Integrated ESP32 Logic

Purpose:
Merge both inputs into one real-time decision system.

Tasks:

- Read distance and sound level in a single sketch
- Normalize distance into a density score
- Smooth microphone readings to reduce spikes
- Apply booth-state decision logic

Planned logic:

```cpp
if (sound > LIMIT) {
    state = "TOO LOUD";
}
else if (density > 70 && energy > 2000) {
    state = "HYPE";
}
else if (energy > 1000) {
    state = "GOOD";
}
else {
    state = "LOW";
}
```

Deliverables:

- Integrated firmware sketch
- Stable state output
- Tunable thresholds for testing

Success criteria:

- Hand movement changes density
- Clapping changes sound level
- State changes match expected behavior

### Phase 4: Serial Dashboard

Purpose:
Create a simple demo-friendly dashboard without WiFi, using only the laptop connection already needed for programming.

Dashboard approach:

- ESP32 sends structured serial data over USB
- Laptop reads the serial stream
- A lightweight local dashboard shows:
  - distance
  - sound level
  - density score
  - current state

Recommended implementation:

- Start with Arduino Serial Monitor for debugging
- Then use one of these simple dashboard options:
  - Arduino Serial Plotter for live graphs
  - Processing desktop sketch reading serial data
  - Python serial dashboard if needed later

Preferred choice for this project:

- Processing-based local dashboard over USB serial

Reason:

- No extra hardware required
- No WiFi dependency
- Better visual demo than plain serial text

Deliverables:

- Structured serial output format
- Local dashboard that updates live over USB

Success criteria:

- Dashboard reflects sensor changes in real time
- State can be shown clearly during demo

### Phase 5: Demo Readiness

Purpose:
Make the system presentable and reliable for a hackathon demo.

Tasks:

- Tune thresholds for your room conditions
- Keep update speed responsive but stable
- Prepare a short demo flow
- Verify that startup and sensor reading work consistently

Demo flow:

1. Show the idle state with no nearby movement
2. Move a hand closer to increase density
3. Clap or speak loudly to raise sound level
4. Show the state changing in real time on the dashboard

Deliverables:

- Stable integrated demo
- Clear serial dashboard
- Simple operator script for presentation

Success criteria:

- Demo can run continuously without reconnecting or resetting
- Output is easy for judges to understand

## Deliverables Summary

### Firmware

- `firmware/sensor_test/vl53l0x_test.ino`
- `firmware/sensor_test/mic_test.ino`
- `firmware/integrated/smart_dj.ino`

### Hardware Documentation

- `hardware/components.md`
- `hardware/wiring_diagram.png`

### Documentation

- `docs/setup_guide.md`
- `docs/architecture.md`
- `docs/demo_script.md`
- `README.md`

### Dashboard

- Local serial dashboard using laptop + USB

## Dashboard Data Format

The ESP32 should send clean serial output that can be parsed easily by the dashboard.

Example:

```text
distance=200,sound=1200,density=78,state=GOOD
```

This format is easy to debug in Serial Monitor and easy to parse in a local desktop dashboard.

## Technical Notes

### Density Mapping

Planned conversion:

```cpp
density = map(distance, 50, 2000, 100, 0);
```

Notes:

- smaller distance means higher crowd density
- values should be clamped so noise does not create invalid results

### Sound Processing

The microphone should not rely on a single raw sample.
Use either:

- average amplitude over a short window
- peak level over a short window

This will make the dashboard and state changes more stable.

## Risks

- USB cable or COM port instability blocks uploads
- I2S microphone pin configuration may be incorrect
- Raw microphone values may be noisy without smoothing
- Thresholds may need tuning depending on room noise

## Immediate Action Plan

### Today

1. Fix the ESP32 USB connection and confirm the COM port.
2. Wire and test the `VL53L0X`.
3. Wire and test the `INMP441`.
4. Confirm both sensors are producing usable serial data.

### Next

1. Build the integrated ESP32 sketch.
2. Add smoothing and state logic.
3. Output structured serial data.
4. Build the simple USB dashboard for the laptop demo.

## Definition of Done

This version is complete when:

- ESP32 uploads reliably
- both sensors work independently
- integrated firmware reads both sensors together
- booth state updates in real time
- a laptop dashboard shows the live values over USB serial
- no WiFi or extra hardware is required
