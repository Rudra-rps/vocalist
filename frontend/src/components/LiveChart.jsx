export default function LiveChart({ title, color, data, metric, max }) {
  const width = 420;
  const height = 180;

  const points = data.length
    ? data
        .map((entry, index) => {
          const x = (index / Math.max(data.length - 1, 1)) * width;
          const y = height - (entry[metric] / max) * height;
          return `${x},${Math.max(8, Math.min(height - 8, y))}`;
        })
        .join(" ")
    : "";

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">{title}</p>
          <p className="mt-1 text-sm text-white/60">Last 30 seconds</p>
        </div>
        <div className="h-3 w-3 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full">
        <defs>
          <linearGradient id={`${metric}-gradient`} x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((line) => (
          <line
            key={line}
            x1="0"
            x2={width}
            y1={height * line}
            y2={height * line}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 8"
          />
        ))}

        {points ? (
          <>
            <polyline fill="none" stroke={color} strokeWidth="4" points={points} strokeLinecap="round" strokeLinejoin="round" />
            <polygon
              fill={`url(#${metric}-gradient)`}
              points={`0,${height} ${points} ${width},${height}`}
            />
          </>
        ) : null}
      </svg>
    </div>
  );
}
