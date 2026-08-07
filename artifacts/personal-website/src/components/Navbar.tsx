import { useState } from "react";
import { Link, useLocation } from "wouter";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/myroblox", label: "My Roblox" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white text-sm">
          <img
            src="https://masg685.netlify.app/masglogo.png"
            alt="Masg685"
            className="w-7 h-7 rounded-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          Masg685
        </Link>

        <div className="hidden sm:flex items-center gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors"
              style={{ color: location === link.href ? "#fca5a5" : "rgba(255,255,255,0.6)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="sm:hidden p-1 transition-colors"
          style={{ color: "rgba(255,255,255,0.6)" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div
          className="sm:hidden border-t px-6 py-3 flex flex-col gap-1"
          style={{
            background: "rgba(0,0,0,0.5)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm"
              style={{ color: location === link.href ? "#fca5a5" : "rgba(255,255,255,0.6)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
