const stateConfig = {
  LOW: { color: "#26f7ff", dot: "bg-sky-400", label: "LOW", description: "Floor is cooling off" },
  GOOD: { color: "#55ff9f", dot: "bg-emerald-400", label: "GOOD", description: "Groove is landing" },
  HYPE: { color: "#ff5c7a", dot: "bg-rose-400", label: "HYPE", description: "Crowd pressure is peaking" },
  "TOO LOUD": { color: "#ffe45c", dot: "bg-amber-300", label: "TOO LOUD", description: "Limiter risk detected" }
};

export default function StateIndicator({ state, connected }) {
  const current = stateConfig[state] ?? stateConfig.LOW;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#091322] p-6 shadow-pink">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${current.color}33, transparent 32%), radial-gradient(circle at 80% 0%, ${current.color}20, transparent 26%)`
        }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Decision Engine</p>
          <div className="mt-4 flex items-center gap-3">
            <span className={`h-4 w-4 rounded-full ${current.dot} animate-beacon`} />
            <h2 className="text-3xl font-black text-white">{current.label}</h2>
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/65">{current.description}</p>
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
          {connected ? "LIVE" : "RECONNECTING"}
        </div>
      </div>
    </div>
  );
}
