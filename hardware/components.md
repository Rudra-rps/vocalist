# Components

## Core Hardware

- `ESP32`
- `VL53L0X` time-of-flight distance sensor
- `INMP441` I2S microphone

## Planned Wiring Notes

### VL53L0X

- `VIN` -> `3V3`
- `GND` -> `GND`
- `SCL` -> ESP32 I2C clock pin
- `SDA` -> ESP32 I2C data pin

### INMP441

- `VDD` -> `3V3`
- `GND` -> `GND`
- `WS` -> GPIO `25`
- `SCK` -> GPIO `26`
- `SD` -> GPIO `33`

## Notes

- Verify your ESP32 board pinout before final wiring.
- The integrated firmware currently assumes the microphone uses:
  - `WS = 25`
  - `SCK = 26`
  - `SD = 33`
- Update the firmware if your board wiring differs.

