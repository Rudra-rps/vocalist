import { useEffect, useState } from "react";

const modes = ["calm", "normal", "concert", "chaos"];

export default function ControlPanel({ data, controls, microphone }) {
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const [values, setValues] = useState({
    distance: data.distance,
    sound: data.sound,
    energy: data.energy
  });

  useEffect(() => {
    setOverrideEnabled(data.manualOverride);
    setValues({
      distance: data.distance,
      sound: data.sound,
      energy: data.energy
    });
  }, [data.distance, data.sound, data.energy, data.manualOverride]);

  const handleModeChange = async (mode) => {
    setOverrideEnabled(false);
    await controls.setOverride(false, values);
    await controls.setMode(mode);
  };

  const handleOverrideToggle = async () => {
    const next = !overrideEnabled;
    setOverrideEnabled(next);
    await controls.setOverride(next, values);
  };

  const handleSliderChange = async (key, value) => {
    const nextValues = { ...values, [key]: Number(value) };
    setValues(nextValues);

    if (overrideEnabled) {
      await controls.updateOverride(nextValues);
    }
  };

  const micStatus =
    microphone.permission === "pending"
      ? microphone.error
      : microphone.permission === "denied"
        ? microphone.error || "Mic access denied."
        : "Microphone connected via ESP32 serial.";

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Control Deck</p>
          <p className="mt-2 text-sm text-white/65">Switch scenarios or grab the sensors manually.</p>
        </div>
        <button
          onClick={() => controls.startDemo()}
          className="rounded-full border border-booth-pink/40 bg-booth-pink/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-booth-pink/25"
        >
          Demo Mode
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {modes.map((mode) => {
          const active = data.mode === mode && !data.manualOverride && !data.demoMode;
          return (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                active
                  ? "border-booth-cyan bg-booth-cyan/15 text-white shadow-neon"
                  : "border-white/10 bg-black/20 text-white/70 hover:border-white/20 hover:text-white"
              }`}
            >
              {mode}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">Manual override</p>
          <p className="text-xs text-white/50">Lock sliders to specific crowd conditions</p>
        </div>
        <button
          onClick={handleOverrideToggle}
          className={`relative h-8 w-16 rounded-full transition ${
            overrideEnabled ? "bg-booth-lime/80" : "bg-white/15"
          }`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
              overrideEnabled ? "left-9" : "left-1"
            }`}
          />
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Microphone</p>
            <p className="text-xs text-white/50">{micStatus}</p>
          </div>
          <div
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${
              microphone.enabled
                ? "border-emerald-400/35 bg-emerald-400/15 text-emerald-300"
                : "border-amber-300/35 bg-amber-300/15 text-amber-200"
            }`}
          >
            {microphone.enabled ? "Connected" : "Waiting"}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <Slider
          label="Distance"
          min={50}
          max={2000}
          value={values.distance}
          suffix="mm"
          onChange={(value) => handleSliderChange("distance", value)}
        />
        <Slider
          label="Sound"
          min={0}
          max={5000}
          value={values.sound}
          suffix="lvl"
          onChange={(value) => handleSliderChange("sound", value)}
        />
        <Slider
          label="Energy"
          min={0}
          max={3000}
          value={values.energy}
          suffix="amp"
          onChange={(value) => handleSliderChange("energy", value)}
        />
      </div>
    </div>
  );
}

function Slider({ label, min, max, value, suffix, onChange, step = 1 }) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{label}</span>
        <span className="text-xs uppercase tracking-[0.25em] text-white/50">
          {value} {suffix}
        </span>
      </div>
      <div className="rounded-full bg-white/5 px-3 py-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="range-slider"
          style={{
            background: `linear-gradient(90deg, #26f7ff 0%, #ff4f9e ${progress}%, rgba(255,255,255,0.15) ${progress}%, rgba(255,255,255,0.15) 100%)`
          }}
        />
      </div>
    </div>
  );
}
