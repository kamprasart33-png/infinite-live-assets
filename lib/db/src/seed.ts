// Run with: pnpm --filter @workspace/db exec tsx src/seed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding database…");

  // ── Tracks ──────────────────────────────────────────────────────────
  const trackRows = [
    { title: "Neon District",        genre: "Cinematic Trap",     duration: "3:12", priceCents: 7900, plays: 2876 },
    { title: "Urban Pulse",          genre: "Cinematic Trap",     duration: "2:58", priceCents: 7900, plays:  987 },
    { title: "Midnight Protocol",    genre: "Dark Ambient",       duration: "5:01", priceCents: 9900, plays:  654 },
    { title: "Celestial Whispers",   genre: "Ethereal Ambience",  duration: "3:24", priceCents: 4900, plays: 1842 },
    { title: "Sakura Dreams",        genre: "Cinematic",          duration: "3:47", priceCents: 6900, plays: 1123 },
    { title: "Golden Hour",          genre: "Lo-Fi Chill",        duration: "4:12", priceCents: 4900, plays: 2340 },
    { title: "Digital Rain",         genre: "Lo-Fi Chill",        duration: "3:55", priceCents: 4900, plays: 1654 },
    { title: "Desert Wind",          genre: "World Fusion",       duration: "4:33", priceCents: 5900, plays:  432 },
    { title: "Crimson Tide",         genre: "Cinematic",          duration: "4:08", priceCents: 6900, plays:  876 },
    { title: "Aurora Protocol",      genre: "Ethereal Ambience",  duration: "5:22", priceCents: 7900, plays:  543 },
    { title: "Steel Horizon",        genre: "Cinematic Trap",     duration: "3:34", priceCents: 7900, plays: 1234 },
    { title: "Monsoon Season",       genre: "World Fusion",       duration: "4:47", priceCents: 5900, plays:  321 },
  ] as const;

  const insertedTracks = await db.insert(schema.tracks).values(trackRows).returning();
  console.log(`  ✓ ${insertedTracks.length} tracks`);

  // ── Customers ────────────────────────────────────────────────────────
  const customerRows = [
    { name: "Sarah Chen",     email: "sarah@creates.io",         status: "active",   totalSpentCents:  89200 },
    { name: "Marcus Rodriguez", email: "marcus@mindful.co",      status: "active",   totalSpentCents:  63100 },
    { name: "Emily Wong",     email: "emily@wfilms.com",         status: "active",   totalSpentCents: 124000 },
    { name: "Apex Studios",   email: "legal@apexstudios.io",     status: "active",   totalSpentCents: 149700 },
    { name: "TrendMedia Co",  email: "music@trendmedia.co",      status: "active",   totalSpentCents: 165900 },
    { name: "Jake Kim",       email: "jake@beatmakers.fm",       status: "inactive", totalSpentCents:  12800 },
    { name: "PodcastPlus",    email: "studio@podcastplus.com",   status: "active",   totalSpentCents:  73500 },
    { name: "FilmForge Ltd",  email: "license@filmforge.com",    status: "active",   totalSpentCents: 209300 },
    { name: "StreamNow",      email: "team@streamnow.tv",        status: "active",   totalSpentCents:  48000 },
    { name: "Beatwave Studio",email: "hi@beatwave.fm",           status: "active",   totalSpentCents:  31200 },
    { name: "Nova Creators",  email: "hello@novacreators.co",    status: "active",   totalSpentCents:  67800 },
    { name: "Zen Pictures",   email: "licensing@zenpix.com",     status: "inactive", totalSpentCents:  19600 },
  ] as const;

  const insertedCustomers = await db.insert(schema.customers).values(customerRows).returning();
  console.log(`  ✓ ${insertedCustomers.length} customers`);

  // ── Transactions with realistic historical dates ──────────────────────
  const daysAgo = (n: number): Date => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
  };

  // [trackIdx, custIdx, licenseType, amountCents, daysBack, status?]
  const txSpec: Array<[number, number, string, number, number, string?]> = [
    // Today
    [0, 4, "Commercial",  7900,   0],
    [1, 0, "YouTube",     4900,   0],
    [5, 6, "YouTube",     4900,   0],
    // Yesterday
    [2, 3, "Enterprise", 49900,   1],
    [3, 1, "Commercial",  7900,   1],
    [6, 8, "YouTube",     4900,   1],
    // 2 days ago
    [0, 7, "Film",       29900,   2],
    [4,10, "Commercial",  6900,   2],
    // This week
    [1, 4, "YouTube",     4900,   3],
    [5, 2, "Film",       29900,   3],
    [9, 7, "Commercial",  7900,   4],
    [3, 0, "YouTube",     4900,   4],
    [10,9, "Commercial",  7900,   5],
    [6, 4, "YouTube",     4900,   5],
    [2, 7, "Film",       29900,   6],
    // This month
    [0,10, "Commercial",  7900,   8],
    [1, 1, "YouTube",     4900,   9],
    [4, 6, "Podcast",     4900,  10],
    [7, 3, "Enterprise", 49900,  11],
    [5, 0, "YouTube",     4900,  12],
    [3, 8, "YouTube",     4900,  13],
    [9, 2, "Film",       29900,  14],
    [11,4, "Commercial",  5900,  15],
    [1, 7, "Film",       29900,  16],
    [6, 1, "YouTube",     4900,  17],
    [0, 9, "Commercial",  7900,  18],
    [10,4, "YouTube",     4900,  19],
    [4, 0, "YouTube",     4900,  20],
    // Expired
    [5, 5, "YouTube",     4900,  65, "expired"],
    [2,11, "Commercial",  7900,  72, "expired"],
    // Older months
    [0, 3, "Enterprise", 49900,  30],
    [1, 7, "Film",       29900,  35],
    [5, 4, "Commercial",  7900,  38],
    [3, 2, "Film",       29900,  42],
    [9, 0, "YouTube",     4900,  45],
    [6, 6, "Podcast",     4900,  48],
    [10,8, "Commercial",  7900,  51],
    [4, 1, "YouTube",     4900,  55],
    [2, 9, "Commercial",  9900,  58],
    [7, 3, "Enterprise", 49900,  62],
    [0,10, "YouTube",     4900,  68],
    [1, 4, "Film",       29900,  74],
    [5, 7, "Commercial",  7900,  80],
    [3, 2, "YouTube",     4900,  87],
    [8, 0, "Podcast",     4900,  93],
    [6, 6, "Commercial",  7900,  99],
    [9, 1, "Film",       29900, 105],
    [11,8, "YouTube",     4900, 112],
    [4, 3, "Enterprise", 49900, 118],
    [0, 4, "Commercial",  7900, 125],
    [2, 9, "YouTube",     4900, 132],
    [10,7, "Film",       29900, 140],
    [1, 2, "Commercial",  7900, 148],
    [7, 0, "YouTube",     4900, 155],
    [5, 6, "Podcast",     4900, 162],
    [3, 4, "Film",       29900, 170],
    [8, 1, "Commercial",  7900, 178],
    [6, 8, "YouTube",     4900, 185],
    [0, 3, "Enterprise", 49900, 192],
    [9, 9, "Commercial",  7900, 200],
    [4, 7, "Film",       29900, 208],
    [11,4, "YouTube",     4900, 215],
    [1, 0, "Commercial",  7900, 223],
    [5, 2, "YouTube",     4900, 230],
    [10,6, "Film",       29900, 238],
    [3, 8, "Commercial",  9900, 245],
    [7, 1, "Enterprise", 49900, 252],
    [2, 4, "YouTube",     4900, 260],
    [6, 9, "Commercial",  7900, 268],
    [0, 7, "Film",       29900, 275],
    [9, 3, "YouTube",     4900, 283],
    [4, 2, "Podcast",     4900, 290],
    [1, 6, "Commercial",  7900, 298],
    [5, 0, "Film",       29900, 305],
    [8, 4, "YouTube",     4900, 312],
    [11,8, "Commercial",  5900, 320],
    [3, 1, "Enterprise", 49900, 328],
    [7, 9, "Film",       29900, 335],
    [0, 6, "YouTube",     4900, 342],
    [6, 2, "Commercial",  7900, 350],
    [10,7, "YouTube",     4900, 358],
    [4, 3, "Film",       29900, 365],
  ];

  let txCount = 0;
  for (const [ti, ci, lt, cents, days, st] of txSpec) {
    const track = insertedTracks[ti];
    const customer = insertedCustomers[ci];
    if (!track || !customer) continue;
    await pool.query(
      `INSERT INTO transactions
         (track_id, customer_id, track_title, customer_name, customer_email,
          license_type, amount_cents, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        track.id, customer.id, track.title, customer.name, customer.email,
        lt, cents, st ?? "active", daysAgo(days),
      ]
    );
    txCount++;
  }

  console.log(`  ✓ ${txCount} transactions`);
  console.log("Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
