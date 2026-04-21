# Smart DJ Booth System

Full-stack simulation of an ESP32-style Smart DJ Booth with live sensor streaming, real-time decision logic, neon dashboard visuals, mode switching, manual overrides, and a scripted demo sequence.

## Stack

- Frontend: React + Tailwind CSS + Vite
- Backend: Node.js + Express
- Real-time: Socket.io
- Storage: in-memory only

## Features

- ESP32 serial bridge for:
  - `distance` from VL53L0X in millimeters
  - `sound` from INMP441 amplitude
- Decision engine:
  - `TOO LOUD` when sound exceeds `3000`
  - `HYPE` when distance is under `300mm` and sound is over `1500`
  - `GOOD` when sound is over `800`
  - `LOW` otherwise
- Live dashboard:
  - gauges
  - state indicator
  - reactive LED strip
  - real-time charts for the last 30 seconds
- Control deck:
  - mode switching
  - manual slider overrides
  - one-click `Demo Mode`
  - hardware microphone status from ESP32 serial

## Project Structure

```text
backend/
  server.js
  simulation.js

frontend/
  src/
    components/
    hooks/
    pages/
```

## Hardware Serial Format

The ESP32 must print one newline-terminated line per reading:

```text
distance,sound
```

Example:

```text
250,1200
```

Backend defaults:

- Serial port: `COM4`
- Baud rate: `115200`

You can override them:

```powershell
$env:SERIAL_PORT="COM5"
$env:SERIAL_BAUD="115200"
npm.cmd run dev:backend
```

## Run Locally

### 1. Install dependencies

From the repo root:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2. Start the backend

```bash
npm run dev:backend
```

The backend runs on `http://localhost:4000`.

Useful backend checks:

```text
http://localhost:4000/data
http://localhost:4000/api/status
http://localhost:4000/api/serial
```

### 3. Start the frontend

In a second terminal:

```bash
npm run dev:frontend
```

The frontend runs on `http://localhost:5173`.

## ESP32 Output Requirement

In Arduino code, use:

```cpp
Serial.print(distance);
Serial.print(",");
Serial.println(sound);
```

Do not print labels like `distance=` or extra debug text on the same serial connection while the dashboard is running.

## Notes

- No database is required.
- All state lives in memory.
- The frontend consumes live socket updates from the backend and falls back to an initial REST status fetch on load.
