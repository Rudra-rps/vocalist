const ledColors = {
  LOW: "#26f7ff",
  GOOD: "#55ff9f",
  HYPE: "#ff5c7a",
  "TOO LOUD": "#ffe45c"
};

export default function LedStrip({ state }) {
  const activeColor = ledColors[state] ?? ledColors.LOW;

  return (
    <div className="overflow-hidden rounded-[26px] border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/45">LED Strip</p>
          <p className="mt-1 text-sm text-white/60">Reactive booth mood lighting</p>
        </div>
        <div className="text-sm font-semibold text-white/80">{state}</div>
      </div>

      <div className="grid grid-cols-12 gap-2">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className="h-8 rounded-full"
            style={{
              background:
                index % 3 === 0
                  ? `linear-gradient(135deg, ${activeColor}, rgba(255,255,255,0.18))`
                  : `linear-gradient(135deg, rgba(255,255,255,0.08), ${activeColor})`,
              boxShadow: `0 0 16px ${activeColor}`,
              animationDelay: `${index * 80}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
}
