import ControlPanel from "../components/ControlPanel";
import CrowdHeatmap from "../components/CrowdHeatmap";
import GaugeCard from "../components/GaugeCard";
import LedStrip from "../components/LedStrip";
import LiveChart from "../components/LiveChart";
import SignalBar from "../components/SignalBar";
import StateIndicator from "../components/StateIndicator";
import { useDJData } from "../hooks/useDJData";

export default function DashboardPage() {
  const { data, connected, history, controls, microphone } = useDJData();

  return (
    <main className="min-h-screen bg-[#040914] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-booth-cyan/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-booth-pink/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-booth-lime/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(10,27,44,0.96),rgba(6,11,23,0.92))] p-6 shadow-[0_24px_120px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-booth-cyan">Smart DJ Booth System</p>
              <h1 className="mt-3 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Club-grade IoT simulation with live crowd intelligence.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">
                Distance drives density, sound drives loudness, vibration becomes crowd energy. The booth reacts in real
                time just like an ESP32 show-control rig, without any physical sensors attached.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Mode" value={data.demoMode ? "demo" : data.manualOverride ? "manual" : data.mode} />
              <Stat label="State" value={data.state} />
              <Stat label="Density" value={`${data.density}%`} />
              <Stat label="Socket" value={connected ? "online" : "retry"} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-6">
              <StateIndicator state={data.state} connected={connected} />
              <LedStrip state={data.state} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <SignalBar label="Crowd density" value={data.density} max={100} color="#26f7ff" />
              <SignalBar label="Sound pressure" value={data.sound} max={5000} color="#ff4f9e" />
              <SignalBar label="Crowd energy" value={data.energy} max={3000} color="#c6ff45" />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-3">
              <GaugeCard label="Distance / Density" value={data.density} max={100} suffix="% dense" tone="density" />
              <GaugeCard label="Sound Level" value={data.sound} max={5000} suffix="sound" tone="sound" />
              <GaugeCard label="Energy Level" value={data.energy} max={3000} suffix="energy" tone="energy" />
            </div>

            <CrowdHeatmap data={data} history={history} />

            <div className="grid gap-6 lg:grid-cols-3">
              <LiveChart title="Sound" color="#ff4f9e" data={history} metric="sound" max={5000} />
              <LiveChart title="Density" color="#26f7ff" data={history} metric="density" max={100} />
              <LiveChart title="Energy" color="#c6ff45" data={history} metric="energy" max={3000} />
            </div>
          </div>

          <ControlPanel data={data} controls={controls} microphone={microphone} />
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">{label}</p>
      <p className="mt-2 text-lg font-bold capitalize text-white">{value}</p>
    </div>
  );
}
