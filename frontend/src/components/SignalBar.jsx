export default function SignalBar({ label, value, max, color }) {
  const height = `${Math.max(10, (value / max) * 100)}%`;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.32em] text-white/40">{label}</p>
      <div className="mt-4 flex h-28 items-end gap-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex-1 overflow-hidden rounded-full bg-white/5">
            <div
              className="animate-pulsebar rounded-full"
              style={{
                height: index < Math.round((value / max) * 8) ? height : "12%",
                background: color,
                boxShadow: `0 0 12px ${color}`,
                animationDelay: `${index * 120}ms`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
