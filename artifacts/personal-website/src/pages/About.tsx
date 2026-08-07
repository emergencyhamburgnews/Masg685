export default function About() {
  const stats: [string, string][] = [
    ["Gamepasses", "+9"],
    ["Police XP", "+340,610 XP"],
    ["Fire & Medical XP", "+21,270 XP"],
    ["Truck Driver XP", "+1,721 XP"],
    ["ADAC XP", "+2,341 XP"],
    ["Bus Driver XP", "+1,454 XP"],
    ["Controller", "Yes"],
    ["Roblox Join Date", "22/11/2023"],
  ];

  const socials = [
    { href: "https://www.tiktok.com/@masg685official?_r=1&_t=ZS-98gEx3RR1O4", label: "TikTok", red: true,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.55V6.79a4.85 4.85 0 01-1.07-.1z"/></svg> },
    { href: "https://www.roblox.com/users/5255024681/profile", label: "Roblox",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.16 0L0 19.84 19.84 24 24 4.16 4.16 0zm12.29 14.63l-5.24-1.25 1.25-5.24 5.24 1.25-1.25 5.24z"/></svg> },
    { href: "https://x.com/masg685rbx", label: "X / Twitter",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { href: "https://discord.com/users/1477229665474318395", label: "Discord",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg> },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">

        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
          About Me
        </h1>

        <div className="flex flex-col lg:flex-row lg:gap-16">

          {/* Left: bio + games + follow */}
          <div className="flex-1 min-w-0 mb-10 lg:mb-0">
            <div className="space-y-4 leading-relaxed mb-10 text-base" style={{ color: "rgba(255,255,255,0.72)" }}>
              <p>Hello, and welcome to my official website!</p>
              <p>
                I’m a proud Samoan who enjoys watching rugby, playing games, and creating fun
                projects. This website is where I share my work, updates, and everything I’m
                passionate about.
              </p>
              <p>Thanks for visiting, and I hope you enjoy your stay!</p>
            </div>

            <div className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                Favourite Games
              </h2>
              <ol className="space-y-2">
                {["Emergency Hamburg", "Rugby Rumble", "Grow A Garden"].map((g, i) => (
                  <li key={g} className="flex items-center gap-3 pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)" }}>
                    <span className="font-bold w-4 text-sm" style={{ color: "#fca5a5" }}>{i + 1}.</span>
                    <span className="text-sm">{g}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                Follow Me
              </h2>
              <div className="flex items-center gap-2.5 flex-wrap">
                {socials.map(({ href, label, icon, red }) => (
                  <a key={label} href={href} title={label} aria-label={label}
                    target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg transition-all"
                    style={red
                      ? { background: "#dc2626", color: "#fff", border: "1px solid #dc2626" }
                      : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.15)" }
                    }>
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: EH Stats */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                Emergency Hamburg Stats
              </h2>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Updated 09/09/2025</span>
            </div>
            <div className="rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <table className="w-full text-sm">
                <tbody>
                  {stats.map(([label, value], i) => (
                    <tr key={label} style={i < stats.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.07)" } : {}}>
                      <td className="px-4 py-3" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</td>
                      <td className="px-4 py-3 font-medium text-right text-white">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
