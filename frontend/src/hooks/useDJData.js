import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";
const API_URL = "http://localhost:4000";

const initialData = {
  mode: "normal",
  demoMode: false,
  manualOverride: false,
  micActive: false,
  serial: {
    connected: false,
    path: "COM4",
    baudRate: 115200,
    source: "waiting",
    malformedCount: 0
  },
  distance: 1180,
  sound: 1100,
  energy: 980,
  density: 44,
  state: "LOW"
};

export function useDJData() {
  const [data, setData] = useState(initialData);
  const [connected, setConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const [micSensitivity, setMicSensitivity] = useState(1);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("update", (payload) => {
      setData(payload);
      setHistory((current) => {
        const next = [...current, payload].slice(-150);
        return next;
      });
    });

    fetch(`${API_URL}/api/status`)
      .then((response) => response.json())
      .then((payload) => setData(payload))
      .catch(() => undefined);

    return () => {
      socket.disconnect();
    };
  }, []);

  const controls = useMemo(
    () => ({
      async setMode(mode) {
        return { ...data, mode };
      },
      async setOverride(enabled, values) {
        return { ...data, manualOverride: enabled, ...values };
      },
      async updateOverride(values) {
        return { ...data, ...values };
      },
      async startDemo() {
        return data;
      },
      setMicSensitivity(value) {
        setMicSensitivity(value);
      }
    }),
    [data]
  );

  return {
    data,
    connected,
    history,
    controls,
    microphone: {
      enabled: data.serial?.connected ?? false,
      sensitivity: micSensitivity,
      permission: data.serial?.connected ? "granted" : "pending",
      error: data.serial?.connected ? "" : `Waiting for ${data.serial?.path ?? "COM4"}`
    }
  };
}
