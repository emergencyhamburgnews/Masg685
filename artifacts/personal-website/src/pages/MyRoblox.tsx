import { useState, useEffect, useCallback } from "react";

interface RobloxUser {
  id: number;
  name: string;
  displayName: string;
  description: string;
  created: string;
}

interface RobloxCounts {
  friends: number | null;
  followers: number | null;
  following: number | null;
}

interface RobloxPresence {
  userPresenceType: number;
  lastLocation: string | null;
  placeId: number | null;
}

interface RobloxGroup {
  group: { id: number; name: string; memberCount: number };
  role: { name: string; rank: number };
}

interface RobloxBadge {
  id: number | string;
  name: string;
  game: string | null;
  imageUrl: string | null;
}

type LoadingState = "idle" | "loading" | "success" | "error";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function StatusBadge({ p }: { p: RobloxPresence | null }) {
  if (!p) return null;
  const t = p.userPresenceType;
  const cfg =
    t === 2 ? { bg: "rgba(21,128,61,0.2)",  color: "#86efac", bord: "rgba(134,239,172,0.3)", dot: "#22c55e",  label: "In Game" + (p.lastLocation ? ` · ${p.lastLocation}` : "") } :
    t === 1 ? { bg: "rgba(29,78,216,0.2)",  color: "#93c5fd", bord: "rgba(147,197,253,0.3)", dot: "#3b82f6",  label: "Online" } :
    t === 3 ? { bg: "rgba(161,98,7,0.2)",   color: "#fde68a", bord: "rgba(253,230,138,0.3)", dot: "#eab308",  label: "In Studio" } :
              { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", bord: "rgba(255,255,255,0.1)", dot: "rgba(255,255,255,0.3)", label: "Offline" };
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded border"
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.bord }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function fmt(n: number | null) { return n === null ? "—" : n.toLocaleString(); }

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function MyRoblox() {
  const [state, setState] = useState<LoadingState>("idle");
  const [user, setUser]         = useState<RobloxUser | null>(null);
  const [avatar, setAvatar]     = useState<string | null>(null);
  const [counts, setCounts]     = useState<RobloxCounts>({ friends: null, followers: null, following: null });
  const [presence, setPresence] = useState<RobloxPresence | null>(null);
  const [prevNames, setPrevNames] = useState<string[]>([]);
  const [groups, setGroups]     = useState<RobloxGroup[]>([]);
  const [badges, setBadges]     = useState<RobloxBadge[]>([]);
  const [updated, setUpdated]   = useState<Date | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setState("loading");
    setError(null);

    const [userData, avatarData, countsData, presenceData, prevNamesData, groupsData, badgesData] =
      await Promise.allSettled([
        api<RobloxUser>("/roblox/user"),
        api<{ data: { imageUrl: string }[] }>("/roblox/avatar"),
        api<RobloxCounts>("/roblox/counts"),
        api<RobloxPresence>("/roblox/presence"),
        api<{ data: { name: string }[] }>("/roblox/previous-names"),
        api<{ data: RobloxGroup[] }>("/roblox/groups"),
        api<{ data: RobloxBadge[] }>("/roblox/badges"),
      ]);

    if (userData.status === "rejected") {
      setError("Could not load Roblox profile. Please try again.");
      setState("error");
      return;
    }

    setUser(userData.value);
    setAvatar(avatarData.status === "fulfilled" ? (avatarData.value.data?.[0]?.imageUrl ?? null) : null);
    setCounts(countsData.status === "fulfilled" ? countsData.value : { friends: null, followers: null, following: null });
    setPresence(presenceData.status === "fulfilled" ? presenceData.value : null);
    setPrevNames(prevNamesData.status === "fulfilled" ? (prevNamesData.value.data?.map((d) => d.name) ?? []) : []);
    setGroups(groupsData.status === "fulfilled" ? (groupsData.value.data ?? []) : []);
    setBadges(badgesData.status === "fulfilled" ? (badgesData.value.data ?? []) : []);
    setUpdated(new Date());
    setState("success");
  }, []);

  useEffect(() => { load(); }, [load]);

  const skeletonBg = "rgba(255,255,255,0.08)";

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.02em" }}>
            My Roblox Profile
          </h1>
          <button
            onClick={load}
            disabled={state === "loading"}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.75)" }}
          >
            <svg className={`w-3.5 h-3.5 ${state === "loading" ? "animate-spin" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {state === "loading" ? "Loading…" : "Refresh"}
          </button>
        </div>

        {/* Skeleton */}
        {state === "loading" && (
          <div className="animate-pulse space-y-6">
            <div className="flex gap-5">
              <div className="w-28 h-36 rounded flex-shrink-0" style={{ background: skeletonBg }} />
              <div className="flex-1 space-y-3 pt-1">
                <div className="h-5 rounded w-2/5" style={{ background: skeletonBg }} />
                <div className="h-3.5 rounded w-1/4" style={{ background: skeletonBg }} />
                <div className="h-3.5 rounded w-3/5" style={{ background: skeletonBg }} />
                <div className="h-3.5 rounded w-1/3" style={{ background: skeletonBg }} />
              </div>
            </div>
            <div className="flex gap-8">
              {[0,1,2].map(i => (
                <div key={i}>
                  <div className="h-3 rounded w-16 mb-2" style={{ background: skeletonBg }} />
                  <div className="h-7 rounded w-10" style={{ background: skeletonBg }} />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-3">
              {[0,1,2,3,4].map(i => (
                <div key={i}>
                  <div className="w-full aspect-square rounded mb-2" style={{ background: skeletonBg }} />
                  <div className="h-3 rounded" style={{ background: skeletonBg }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="py-6 text-center">
            <p className="text-sm mb-4" style={{ color: "#fca5a5" }}>{error}</p>
            <button onClick={load}
              className="px-5 py-2 text-sm rounded transition-colors"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {state === "success" && user && (
          <div className="flex flex-col lg:flex-row lg:gap-12 lg:items-start">

            {/* LEFT: profile card + counts + prev names */}
            <div className="lg:w-72 lg:flex-shrink-0 space-y-6 mb-8 lg:mb-0">

              <div className="rounded-lg p-5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex gap-4 items-start">
                  {avatar
                    ? <img src={avatar} alt="avatar" className="w-24 rounded object-cover flex-shrink-0"
                        style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                    : <div className="w-24 h-32 rounded flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white mb-1">{user.displayName}</h2>
                    <StatusBadge p={presence} />
                    <p className="text-sm mt-1 mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>@{user.name}</p>
                    {user.description
                      ? <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>{user.description}</p>
                      : null
                    }
                    <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Joined {fmtDate(user.created)}</p>
                    <a href={`https://www.roblox.com/users/${user.id}/profile`} target="_blank" rel="noopener noreferrer"
                      className="text-xs hover:underline font-medium" style={{ color: "#fca5a5" }}>
                      View on Roblox →
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 flex-wrap" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem" }}>
                {([
                  ["Friends",   fmt(counts.friends)],
                  ["Followers", fmt(counts.followers)],
                  ["Following", fmt(counts.following)],
                ] as [string, string][]).map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                    <p className="text-2xl font-bold text-white">{val}</p>
                  </div>
                ))}
              </div>

              {prevNames.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Previous Usernames</p>
                  <div className="flex flex-wrap gap-2">
                    {prevNames.map(n => (
                      <span key={n} className="px-2.5 py-1 text-xs rounded font-mono"
                        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>{n}</span>
                    ))}
                  </div>
                </div>
              )}

              {updated && (
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Updated {updated.toLocaleTimeString()}</p>
              )}
            </div>

            {/* RIGHT: groups + badges */}
            <div className="flex-1 min-w-0 space-y-8">

              {groups.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Groups</p>
                  <div className="rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {groups.map(({ group, role }, i) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between px-4 py-3"
                        style={i < groups.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.07)" } : {}}
                      >
                        <span className="text-sm font-medium text-white">{group.name}</span>
                        <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{role?.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {badges.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Recent Badges</p>
                  <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
                    {badges.map(badge => (
                      <div key={String(badge.id)} className="text-center">
                        {badge.imageUrl
                          ? <img src={badge.imageUrl} alt={badge.name}
                              className="w-full aspect-square rounded object-cover mb-1.5"
                              style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                          : <div className="w-full aspect-square rounded mb-1.5 flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                        }
                        <p className="text-xs leading-tight line-clamp-2" style={{ color: "rgba(255,255,255,0.7)" }}>{badge.name}</p>
                        {badge.game && <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{badge.game}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
