const ICONS = {
  roblox: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.16 0L0 19.84 19.84 24 24 4.16 4.16 0zm12.29 14.63l-5.24-1.25 1.25-5.24 5.24 1.25-1.25 5.24z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  controller: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 4H7C3.13 4 0 7.13 0 11c0 2.76 1.58 5.15 3.88 6.38L5 20h14l1.12-2.62C22.42 16.15 24 13.76 24 11c0-3.87-3.13-7-7-7zM9 13H7v2H5v-2H3v-2h2V9h2v2h2v2zm6.5 1c-.83 0-1.5-.67-1.5-1.5S14.67 11 15.5 11s1.5.67 1.5 1.5S16.33 14 15.5 14zm2-3c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5S18.33 11 17.5 11z" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5L1 9l11 12L23 9l-4-6zm-7 14.5L4.5 9.5 7.5 5h9l3 4.5L12 17.5z" />
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
};

type IconKey = keyof typeof ICONS;

interface IconDef {
  icon: IconKey;
  size: number;
  x: number;
  y: number;
  rot: number;
  opacity: number;
  anim: number;
}

const PLACEMENTS: IconDef[] = [
  { icon: "roblox",     size: 96,  x: 3,   y: 8,   rot: 20,  opacity: 0.07, anim: 0 },
  { icon: "tiktok",     size: 72,  x: 88,  y: 5,   rot: -15, opacity: 0.06, anim: 1 },
  { icon: "star",       size: 48,  x: 15,  y: 55,  rot: 10,  opacity: 0.05, anim: 2 },
  { icon: "diamond",    size: 80,  x: 78,  y: 45,  rot: -20, opacity: 0.06, anim: 0 },
  { icon: "controller", size: 88,  x: 55,  y: 78,  rot: 8,   opacity: 0.06, anim: 1 },
  { icon: "roblox",     size: 56,  x: 92,  y: 72,  rot: -5,  opacity: 0.05, anim: 2 },
  { icon: "tiktok",     size: 44,  x: 40,  y: 12,  rot: 25,  opacity: 0.04, anim: 0 },
  { icon: "star",       size: 36,  x: 68,  y: 20,  rot: -30, opacity: 0.05, anim: 1 },
  { icon: "diamond",    size: 52,  x: 8,   y: 78,  rot: 12,  opacity: 0.05, anim: 2 },
  { icon: "controller", size: 64,  x: 30,  y: 88,  rot: -10, opacity: 0.05, anim: 0 },
  { icon: "roblox",     size: 40,  x: 62,  y: 58,  rot: 40,  opacity: 0.04, anim: 1 },
  { icon: "star",       size: 28,  x: 22,  y: 30,  rot: 15,  opacity: 0.04, anim: 2 },
  { icon: "tiktok",     size: 60,  x: 5,   y: 42,  rot: -8,  opacity: 0.05, anim: 0 },
  { icon: "diamond",    size: 36,  x: 85,  y: 85,  rot: 30,  opacity: 0.04, anim: 1 },
  { icon: "cross",      size: 44,  x: 48,  y: 40,  rot: -25, opacity: 0.04, anim: 2 },
];

const floatKeyframes = `
  @keyframes float0 {
    0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
    50%       { transform: translateY(-14px) rotate(var(--rot)); }
  }
  @keyframes float1 {
    0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
    50%       { transform: translateY(-10px) rotate(var(--rot)); }
  }
  @keyframes float2 {
    0%, 100% { transform: translateY(0px) rotate(var(--rot)); }
    50%       { transform: translateY(-18px) rotate(var(--rot)); }
  }
`;

export default function DecorativeBg() {
  return (
    <>
      <style>{floatKeyframes}</style>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {PLACEMENTS.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              color: "#fff",
              ["--rot" as any]: `${p.rot}deg`,
              animation: `float${p.anim} ${7 + (i % 4)}s ease-in-out ${(i * 0.7) % 4}s infinite`,
              transform: `rotate(${p.rot}deg)`,
            }}
          >
            {ICONS[p.icon]}
          </div>
        ))}
      </div>
    </>
  );
}
