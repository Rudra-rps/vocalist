const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function generateRadarPoints(data, history) {
  const pointCount = Math.max(3, Math.round(3 + (data.density / 100) * 8 + (data.energy / 3000) * 4));
  const now = data.timestamp || Date.now();
  const recentDelta =
    history.length > 4 ? Math.abs((history.at(-1)?.distance ?? data.distance) - (history.at(-5)?.distance ?? data.distance)) / 1950 : 0.08;

  return Array.from({ length: pointCount }, (_, index) => {
    const spread = (Math.sin(now / 650 + index * 0.9) + Math.cos(now / 980 + index * 0.4)) * 0.5;
    const angle = clamp(spread * 34, -40, 40);
    const depthBase = clamp(data.distance / 2000, 0.08, 1);
    const depthVariance = ((Math.sin(now / 540 + index * 1.3) + 1) / 2) * 0.28;
    const depth = clamp(depthBase * 0.72 + depthVariance + recentDelta * 0.18, 0.1, 1);
    const intensity = clamp((1 - depth) * 0.72 + data.energy / 3000 * 0.2 + data.sound / 5000 * 0.08, 0.2, 1);

    return {
      id: index,
      angle,
      depth,
      intensity,
      size: 6 + intensity * 10
    };
  });
}

function polarToPoint(angleDeg, depth, width, height) {
  const centerX = width / 2;
  const baseY = height - 26;
  const maxRadius = height - 52;
  const angleRad = (angleDeg * Math.PI) / 180;
  const radius = clamp(depth, 0.05, 1) * maxRadius;

  return {
    x: centerX + Math.sin(angleRad) * radius,
    y: baseY - Math.cos(angleRad) * radius
  };
}

export default function CrowdHeatmap({ data, history = [] }) {
  const width = 720;
  const height = 420;
  const points = generateRadarPoints(data, history);
  const nearest = Math.round(data.distance);
  const coneWidth = Math.round(26 + (data.density / 100) * 26);
  const pressure = Math.round((data.energy / 3000) * 100);

  return (
    <div className="rounded-[30px] border border-white/10 bg-white/5 p-5 shadow-neon">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">Crowd Radar</p>
          <h3 className="mt-2 text-2xl font-black text-white">Forward sensor crowd scan</h3>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Single-direction range view from the booth. Blips represent crowd detections inside the forward sensing cone.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MetricPill label="Nearest" value={`${nearest} mm`} />
          <MetricPill label="Cone" value={`${coneWidth} deg`} />
          <MetricPill label="Pressure" value={`${pressure}%`} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#05101a] p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(38,247,255,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />

          <svg viewBox={`0 0 ${width} ${height}`} className="relative h-[360px] w-full">
            <defs>
              <linearGradient id="scanFill" x1="0%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="rgba(38,247,255,0.00)" />
                <stop offset="100%" stopColor="rgba(38,247,255,0.18)" />
              </linearGradient>
              <radialGradient id="blipGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
                <stop offset="100%" stopColor="rgba(38,247,255,0.05)" />
              </radialGradient>
            </defs>

            {[0.25, 0.5, 0.75, 1].map((ratio) => {
              const radius = (height - 52) * ratio;
              const startX = width / 2 - radius;
              const arcY = height - 26 - radius;
              return (
                <path
                  key={ratio}
                  d={`M ${startX} ${height - 26} A ${radius} ${radius} 0 0 1 ${width / 2 + radius} ${height - 26}`}
                  fill="none"
                  stroke="rgba(38,247,255,0.18)"
                  strokeDasharray="5 7"
                />
              );
            })}

            {[-40, -20, 0, 20, 40].map((angle) => {
              const outer = polarToPoint(angle, 1, width, height);
              return (
                <line
                  key={angle}
                  x1={width / 2}
                  y1={height - 26}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(38,247,255,0.13)"
                />
              );
            })}

            <path
              d={`M ${width / 2} ${height - 26} L ${polarToPoint(-42, 1, width, height).x} ${polarToPoint(-42, 1, width, height).y} A ${height - 52} ${height - 52} 0 0 1 ${polarToPoint(42, 1, width, height).x} ${polarToPoint(42, 1, width, height).y} Z`}
              fill="rgba(38,247,255,0.04)"
              stroke="rgba(38,247,255,0.12)"
            />

            <line
              x1={width / 2}
              y1={height - 26}
              x2={polarToPoint(((now => ((now / 18) % 84) - 42))(data.timestamp || Date.now()), 1, width, height).x}
              y2={polarToPoint(((now => ((now / 18) % 84) - 42))(data.timestamp || Date.now()), 1, width, height).y}
              stroke="rgba(104,255,246,0.9)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {points.map((point) => {
              const position = polarToPoint(point.angle, point.depth, width, height);
              return (
                <g key={point.id}>
                  <circle cx={position.x} cy={position.y} r={point.size * 1.9} fill="rgba(38,247,255,0.08)" />
                  <circle cx={position.x} cy={position.y} r={point.size} fill="url(#blipGlow)" />
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={Math.max(3, point.size * 0.42)}
                    fill={point.intensity > 0.8 ? "#ffe45c" : point.intensity > 0.6 ? "#ff5c7a" : "#26f7ff"}
                  />
                </g>
              );
            })}

            <rect x={width / 2 - 54} y={height - 24} width="108" height="18" rx="9" fill="rgba(255,255,255,0.12)" />
            <rect x={width / 2 - 28} y={height - 44} width="56" height="24" rx="10" fill="rgba(255,255,255,0.2)" />

            <text x={width / 2} y={height - 56} textAnchor="middle" fill="rgba(255,255,255,0.72)" fontSize="12" letterSpacing="3">
              DJ BOOTH
            </text>
            <text x={width / 2} y="24" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="12" letterSpacing="4">
              CROWD AREA
            </text>
          </svg>
        </div>

        <div className="space-y-4">
          <LegendCard
            title="Sensor Readout"
            lines={[
              `Distance sensor is modeled as a forward cone only.`,
              `Closer crowd positions create denser near-field blips.`,
              `Energy and sound increase blip size and intensity.`
            ]}
          />
          <LegendCard
            title="Range Rings"
            lines={["25% = near pit", "50% = mid crowd", "75% = rear crowd", "100% = max sensor reach"]}
            palette
          />
        </div>
      </div>
    </div>
  );
}

function MetricPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function LegendCard({ title, lines, palette = false }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.32em] text-white/45">{title}</p>
      {palette ? (
        <div className="mt-4 space-y-3 text-sm text-white/70">
          {lines.map((line) => (
            <div key={line} className="flex items-center gap-3">
              <span className="h-2 w-10 rounded-full bg-gradient-to-r from-booth-cyan/40 to-white/10" />
              <span>{line}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 space-y-2 text-sm text-white/65">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
