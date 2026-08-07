import { Router, type IRouter } from "express";

const router: IRouter = Router();

const USER_ID = "5255024681";
const USER_ID_NUM = 5255024681;

async function robloxGet(url: string) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`Roblox ${res.status}: ${url}`);
  return res.json();
}

async function robloxPost(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Roblox ${res.status}: ${url}`);
  return res.json();
}

// Basic user info
router.get("/user", async (_req, res) => {
  try {
    res.json(await robloxGet(`https://users.roblox.com/v1/users/${USER_ID}`));
  } catch {
    res.status(502).json({ error: "Failed to fetch user" });
  }
});

// Full body avatar (replaces headshot)
router.get("/avatar", async (_req, res) => {
  try {
    const data = await robloxGet(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${USER_ID}&size=420x420&format=Png&isCircular=false`
    );
    res.json(data);
  } catch {
    res.status(502).json({ error: "Failed to fetch avatar" });
  }
});

// Headshot (kept for backwards compat)
router.get("/headshot", async (_req, res) => {
  try {
    const data = await robloxGet(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${USER_ID}&size=420x420&format=Png&isCircular=false`
    );
    res.json(data);
  } catch {
    res.status(502).json({ error: "Failed to fetch headshot" });
  }
});

// Friends + followers + following
router.get("/counts", async (_req, res) => {
  try {
    const [friends, followers, following] = await Promise.allSettled([
      robloxGet(`https://friends.roblox.com/v1/users/${USER_ID}/friends/count`),
      robloxGet(`https://friends.roblox.com/v1/users/${USER_ID}/followers/count`),
      robloxGet(`https://friends.roblox.com/v1/users/${USER_ID}/followings/count`),
    ]);
    res.json({
      friends:    friends.status    === "fulfilled" ? (friends.value.count    ?? null) : null,
      followers:  followers.status  === "fulfilled" ? (followers.value.count  ?? null) : null,
      following:  following.status  === "fulfilled" ? (following.value.count  ?? null) : null,
    });
  } catch {
    res.status(502).json({ error: "Failed to fetch counts" });
  }
});

// Online / in-game presence
router.get("/presence", async (_req, res) => {
  try {
    const data = await robloxPost("https://presence.roblox.com/v1/presence/users", {
      userIds: [USER_ID_NUM],
    });
    res.json(data?.userPresences?.[0] ?? null);
  } catch {
    res.status(502).json({ error: "Failed to fetch presence" });
  }
});

// Previous usernames
router.get("/previous-names", async (_req, res) => {
  try {
    res.json(
      await robloxGet(
        `https://users.roblox.com/v1/users/${USER_ID}/username-history?limit=10&sortOrder=Desc`
      )
    );
  } catch {
    res.status(502).json({ error: "Failed to fetch previous names" });
  }
});

// Groups
router.get("/groups", async (_req, res) => {
  try {
    res.json(
      await robloxGet(`https://groups.roblox.com/v1/users/${USER_ID}/groups/roles`)
    );
  } catch {
    res.status(502).json({ error: "Failed to fetch groups" });
  }
});

// Recent badges with icon thumbnails merged in
router.get("/badges", async (_req, res) => {
  try {
    const badgeData = await robloxGet(
      `https://badges.roblox.com/v1/users/${USER_ID}/badges?limit=10&sortOrder=Desc`
    );
    const badges: { id: number | string; name: string; displayName: string; awarder?: { name: string } }[] =
      badgeData?.data ?? [];

    if (badges.length === 0) return res.json({ data: [] });

    const ids = badges.map((b) => b.id).join(",");
    const thumbData = await robloxGet(
      `https://thumbnails.roblox.com/v1/badges/icons?badgeIds=${ids}&size=150x150&format=Png&isCircular=false`
    ).catch(() => ({ data: [] }));

    const thumbMap: Record<string, string> = {};
    for (const t of thumbData?.data ?? []) {
      if (t.imageUrl) thumbMap[String(t.targetId)] = t.imageUrl;
    }

    const merged = badges.map((b) => ({
      id:         b.id,
      name:       b.displayName || b.name,
      game:       b.awarder?.name ?? null,
      imageUrl:   thumbMap[String(b.id)] ?? null,
    }));

    res.json({ data: merged });
  } catch {
    res.status(502).json({ error: "Failed to fetch badges" });
  }
});

export default router;
