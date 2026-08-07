import { useEffect, useState } from "react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const icons = {
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  ),
  roblox: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.16 0L0 19.84 19.84 24 24 4.16 4.16 0zm12.29 14.63l-5.24-1.25 1.25-5.24 5.24 1.25-1.25 5.24z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

function IconBtn({ href, label, icon, red = false, target }: {
  href: string; label: string; icon: React.ReactNode; red?: boolean; target?: string;
}) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      target={target}
      rel={target ? "noopener noreferrer" : undefined}
      className="w-10 h-10 flex items-center justify-center rounded-lg transition-all"
      style={red
        ? { background: "#dc2626", color: "#fff", border: "1px solid rgba(255,255,255,0.45)", boxShadow: "0 4px 14px rgba(0,0,0,0.24)" }
        : { background: "rgba(255,255,255,0.16)", color: "#fff", border: "1px solid rgba(255,255,255,0.42)", boxShadow: "0 4px 14px rgba(0,0,0,0.24)" }
      }
    >
      <span className="social-link-icon" style={{ width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </span>
    </a>
  );
}

function TikTokCard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.25)" }}>

      {/* Header bar */}
      <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <span style={{ color: "#fe2c55", width: 18, height: 18, display: "flex" }}>{icons.tiktok}</span>
        <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>My TikTok</span>
      </div>

      {/* Body */}
      <div className="flex flex-col items-center text-center px-8 py-10 gap-5">

        {/* Big TikTok icon */}
        <div className="flex items-center justify-center rounded-2xl"
          style={{ width: 80, height: 80, background: "#fe2c55", color: "#fff", flexShrink: 0 }}>
          <span style={{ width: 44, height: 44, display: "flex" }}>{icons.tiktok}</span>
        </div>

        <div>
          <p className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>@masg685official</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            Emergency Hamburg content creator
          </p>
        </div>

        <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          I post clips, funny moments, and updates from Emergency Hamburg. Follow me to stay in the loop!
        </p>

        <a
          href="https://www.tiktok.com/@masg685official?_r=1&_t=ZS-98gEx3RR1O4"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white transition-all"
          style={{ background: "#fe2c55" }}
        >
          <span style={{ width: 16, height: 16, display: "flex" }}>{icons.tiktok}</span>
          Follow on TikTok
          <span style={{ width: 16, height: 16, display: "flex" }}>{icons.arrow}</span>
        </a>

      </div>
    </div>
  );
}

export default function Home() {
  const [robloxAvatar, setRobloxAvatar] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`${BASE}/api/roblox/avatar`, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`Avatar request failed: ${response.status}`);
        return response.json() as Promise<{ data?: { imageUrl?: string | null }[] }>;
      })
      .then((payload) => {
        const imageUrl = payload.data?.[0]?.imageUrl ?? null;
        if (active) setRobloxAvatar(imageUrl);
      })
      .catch(() => {
        if (active) setRobloxAvatar(null);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16">

          {/* LEFT: Profile */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-72 lg:flex-shrink-0 mb-10 lg:mb-0">

            <div
              className="relative -top-2 w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden mb-5"
              style={{ border: "3px solid rgba(255,255,255,0.3)", boxShadow: "0 7px 26px rgba(0,0,0,0.46)", background: "linear-gradient(145deg, #f97316, #dc2626)" }}
            >
              {robloxAvatar ? (
                <img
                  src={robloxAvatar}
                  alt="Masg685 live Roblox avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold" aria-label="Loading Roblox avatar">
                  M
                </div>
              )}
            </div>

            <h1
              className="text-3xl lg:text-4xl font-bold text-white mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}
            >
              Masg685
            </h1>
            <p className="text-sm italic mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>Talofa lava</p>

            <p className="text-sm leading-relaxed mb-7 max-w-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
              Follow my TikTok
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-center lg:justify-start mb-8">
              <IconBtn href="https://www.tiktok.com/@masg685official?_r=1&_t=ZS-98gEx3RR1O4" label="TikTok" icon={icons.tiktok} red target="_blank" />
              <IconBtn href="https://www.roblox.com/users/5255024681/profile"    label="Roblox"      icon={icons.roblox}  target="_blank" />
              <IconBtn href="https://x.com/masg685rbx"                           label="X / Twitter" icon={icons.x}       target="_blank" />
              <IconBtn href="https://discord.com/users/1477229665474318395"       label="Discord"     icon={icons.discord} target="_blank" />
              <IconBtn href="/about"                                               label="About Me"    icon={icons.about} />
            </div>
          </div>

          {/* RIGHT: TikTok card */}
          <div className="flex-1 min-w-0">
            <TikTokCard />
          </div>

        </div>
      </div>
    </div>
  );
}
