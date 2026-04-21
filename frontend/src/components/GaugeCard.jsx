const progressColor = {
  density: "#26f7ff",
  sound: "#ff4f9e",
  energy: "#c6ff45"
};

export default function GaugeCard({ label, value, max, suffix = "", tone = "density" }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const normalized = Math.max(0, Math.min(1, value / max));
  const dashOffset = circumference - circumference * normalized;
  const color = progressColor[tone];

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-neon backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(38,247,255,0.14),transparent_45%)]" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">{label}</p>
          <p className="mt-1 text-sm text-white/60">Live sensor stream</p>
        </div>
        <div className="h-2 w-16 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${normalized * 100}%`,
              background: color,
              boxShadow: `0 0 16px ${color}`
            }}
          />
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center">
        <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
          <circle cx="90" cy="90" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 12px ${color})` }}
          />
        </svg>
        <div className="absolute text-center">
          <div className="text-4xl font-black text-white">{value}</div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/50">{suffix}</div>
        </div>
      </div>
    </div>
  );
}
