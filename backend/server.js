import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { ReadlineParser, SerialPort } from "serialport";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const HTTP_PORT = process.env.PORT || 4000;
const SERIAL_PATH = process.env.SERIAL_PORT || "COM4";
const SERIAL_BAUD = Number(process.env.SERIAL_BAUD || 115200);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

let serialPort = null;
let malformedCount = 0;
let latestData = buildDashboardPayload({
  distance: 2000,
  sound: 0,
  source: "waiting"
});

function computeState(distance, sound) {
  if (sound > 3000) return "TOO LOUD";
  if (distance < 300 && sound > 1500) return "HYPE";
  if (sound > 800) return "GOOD";
  return "LOW";
}

function densityFromDistance(distance) {
  const normalized = 1 - (distance - 50) / 1950;
  return Math.round(clamp(normalized * 100, 0, 100));
}

function deriveEnergy(sound) {
  return Math.round(clamp((sound / 5000) * 3000, 0, 3000));
}

function buildDashboardPayload({ distance, sound, source = "serial" }) {
  return {
    timestamp: Date.now(),
    distance,
    sound,
    state: computeState(distance, sound),
    density: densityFromDistance(distance),
    energy: deriveEnergy(sound),
    mode: "hardware",
    demoMode: false,
    manualOverride: false,
    micActive: source === "serial",
    serial: {
      path: SERIAL_PATH,
      baudRate: SERIAL_BAUD,
      connected: Boolean(serialPort?.isOpen),
      source,
      malformedCount
    }
  };
}

function parseSerialLine(line) {
  const trimmed = line.trim();

  if (!trimmed) {
    return null;
  }

  const parts = trimmed.split(",");
  if (parts.length !== 2) {
    throw new Error(`Expected "distance,sound", received "${trimmed}"`);
  }

  const distance = Number(parts[0]);
  const sound = Number(parts[1]);

  if (!Number.isFinite(distance) || !Number.isFinite(sound)) {
    throw new Error(`Non-numeric serial data: "${trimmed}"`);
  }

  if (distance < 0 || sound < 0) {
    throw new Error(`Negative serial data: "${trimmed}"`);
  }

  return {
    distance: Math.round(distance),
    sound: Math.round(sound)
  };
}

function publish(payload) {
  latestData = payload;
  io.emit("update", payload);

  // Keep the existing React dashboard working without changing its visual layer.
  io.emit("dj:update", payload);
}

function handleSerialLine(line) {
  try {
    const parsed = parseSerialLine(line);

    if (!parsed) {
      return;
    }

    publish(buildDashboardPayload(parsed));
  } catch (error) {
    malformedCount += 1;
    console.warn(`[serial] Ignored malformed line: ${error.message}`);
  }
}

function connectSerialPort() {
  if (serialPort) {
    return;
  }

  serialPort = new SerialPort({
    path: SERIAL_PATH,
    baudRate: SERIAL_BAUD,
    autoOpen: false
  });

  const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\n" }));

  parser.on("data", handleSerialLine);

  serialPort.on("open", () => {
    console.log(`[serial] Connected to ${SERIAL_PATH} at ${SERIAL_BAUD} baud`);
    publish(buildDashboardPayload({ distance: latestData.distance, sound: latestData.sound, source: "serial" }));
  });

  serialPort.on("error", (error) => {
    console.error(`[serial] ${error.message}`);
  });

  serialPort.on("close", () => {
    console.warn(`[serial] ${SERIAL_PATH} closed`);
    latestData = buildDashboardPayload({
      distance: latestData.distance,
      sound: latestData.sound,
      source: "disconnected"
    });
    io.emit("update", latestData);
    io.emit("dj:update", latestData);
    serialPort = null;

    setTimeout(connectSerialPort, 3000);
  });

  serialPort.open((error) => {
    if (error) {
      console.error(`[serial] Could not open ${SERIAL_PATH}: ${error.message}`);
      serialPort = null;
      setTimeout(connectSerialPort, 3000);
    }
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

app.get("/data", (_req, res) => {
  res.json({
    distance: latestData.distance,
    sound: latestData.sound,
    state: latestData.state
  });
});

app.get("/api/status", (_req, res) => {
  res.json(latestData);
});

app.get("/api/serial", (_req, res) => {
  res.json(latestData.serial);
});

io.on("connection", (socket) => {
  socket.emit("update", latestData);
  socket.emit("dj:update", latestData);
});

httpServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`[server] Port ${HTTP_PORT} is already in use. Stop the old backend or run with a different PORT.`);
    process.exitCode = 1;
    return;
  }

  console.error(`[server] ${error.message}`);
  process.exitCode = 1;
});

httpServer.listen(HTTP_PORT, () => {
  console.log(`Smart DJ serial bridge listening on http://localhost:${HTTP_PORT}`);
  console.log(`[serial] Waiting for ESP32 data as "distance,sound" on ${SERIAL_PATH} at ${SERIAL_BAUD}`);
  connectSerialPort();
});
