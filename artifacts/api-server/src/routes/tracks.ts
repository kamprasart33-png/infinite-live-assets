import { Router } from "express";
import { getAllTracks, getTopSellingTracks } from "../services/tracks.service";
import { requireAdmin } from "../middlewares/authMiddleware";
import { db } from "@workspace/db";
import { tracks } from "@workspace/db/schema";
import { randomUUID } from "node:crypto";
import { and, eq, isNull, sql } from "drizzle-orm";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = Router();
export function audioClient() {
  const { AUDIO_S3_ENDPOINT, AUDIO_S3_REGION, AUDIO_S3_ACCESS_KEY_ID, AUDIO_S3_SECRET_ACCESS_KEY } = process.env;
  if (!AUDIO_S3_ENDPOINT || !AUDIO_S3_ACCESS_KEY_ID || !AUDIO_S3_SECRET_ACCESS_KEY) throw new Error("Audio storage is not configured");
  return new S3Client({ region: AUDIO_S3_REGION || "auto", endpoint: AUDIO_S3_ENDPOINT,
    requestChecksumCalculation: "WHEN_REQUIRED",
    credentials: { accessKeyId: AUDIO_S3_ACCESS_KEY_ID, secretAccessKey: AUDIO_S3_SECRET_ACCESS_KEY } });
}

// The browser sends the file directly to object storage, avoiding the Netlify
// proxy and Render request-size limits. Keep this bucket private.
router.post("/tracks/upload-ticket", requireAdmin, async (req, res) => {
  const { name, size, type } = req.body ?? {};
  if (typeof name !== "string" || name.length > 255 || !name ||
      !Number.isSafeInteger(size) || size < 1 || size > 50 * 1024 * 1024 ||
      !["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "audio/x-wav"].includes(type)) {
    res.status(400).json({ error: "Choose an MP3, M4A, or WAV file under 50 MB." });
    return;
  }
  const { AUDIO_S3_ENDPOINT, AUDIO_S3_REGION, AUDIO_S3_BUCKET, AUDIO_S3_ACCESS_KEY_ID, AUDIO_S3_SECRET_ACCESS_KEY } = process.env;
  if (!AUDIO_S3_ENDPOINT || !AUDIO_S3_BUCKET || !AUDIO_S3_ACCESS_KEY_ID || !AUDIO_S3_SECRET_ACCESS_KEY) {
    res.status(503).json({ error: "Audio storage is not configured yet." });
    return;
  }
  try {
    const client = audioClient();
    const key = `tracks/${randomUUID()}${type === "audio/mpeg" ? ".mp3" : type.includes("wav") ? ".wav" : ".m4a"}`;
    const url = await getSignedUrl(client, new PutObjectCommand({ Bucket: AUDIO_S3_BUCKET, Key: key, ContentType: type }), { expiresIn: 600 });
    res.json({ url, key });
  } catch {
    res.status(500).json({ error: "Could not prepare audio upload." });
  }
});

router.post("/tracks", requireAdmin, async (req, res) => {
  const { title, artist, genre, duration, priceCents, key } = req.body ?? {};
  if (typeof title !== "string" || !title.trim() || title.length > 255 ||
      typeof artist !== "string" || !artist.trim() || artist.length > 255 ||
      typeof genre !== "string" || genre.length > 100 ||
      typeof duration !== "string" || duration.length > 20 ||
      !Number.isSafeInteger(priceCents) || priceCents < 0 ||
      typeof key !== "string" || !/^tracks\/[a-f0-9-]{36}\.(mp3|m4a|wav)$/.test(key)) {
    res.status(400).json({ error: "Valid track details and uploaded audio are required." });
    return;
  }
  try {
    if (!process.env.AUDIO_S3_BUCKET) throw new Error("Audio storage is not configured");
    const object = await audioClient().send(new HeadObjectCommand({ Bucket: process.env.AUDIO_S3_BUCKET, Key: key }));
    if (!object.ContentType?.startsWith("audio/") || !object.ContentLength || object.ContentLength > 50 * 1024 * 1024) {
      res.status(400).json({ error: "Uploaded audio file is invalid." });
      return;
    }
    const [track] = await db.insert(tracks).values({ title: title.trim(), artist: artist.trim(), genre: genre.trim(), duration: duration.trim(), priceCents, fileUrl: `s3:${key}` }).returning();
    res.status(201).json({ id: track.id, title: track.title, audioReady: true });
  } catch {
    res.status(500).json({ error: "Could not save track." });
  }
});

router.get("/tracks", requireAdmin, async (_req, res) => {
  try {
    const data = await getAllTracks();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tracks" });
  }
});

router.get("/tracks/top-selling", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const data = await getTopSellingTracks(limit);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});


// Track administration. The same advisory lock serializes checkout creation,
// archive and deletion for a track, including across API instances.
router.patch("/tracks/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { title, artist, genre, duration, priceCents } = req.body ?? {};
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647 ||
      typeof title !== "string" || !title.trim() || title.length > 255 ||
      typeof artist !== "string" || !artist.trim() || artist.length > 255 ||
      typeof genre !== "string" || genre.length > 100 ||
      typeof duration !== "string" || duration.length > 20 ||
      !Number.isSafeInteger(priceCents) || priceCents < 0 || priceCents > 2147483647) {
    res.status(400).json({ error: "Enter valid track details and price." }); return;
  }
  try {
    const [row] = await db.update(tracks).set({ title: title.trim(), artist: artist.trim(),
      genre: genre.trim(), duration: duration.trim(), priceCents }).where(and(eq(tracks.id, id), isNull(tracks.deletedAt))).returning();
    if (!row) { res.status(404).json({ error: "Track not found." }); return; }
    const { fileUrl, ...track } = row;
    res.json({ ...track, audioReady: Boolean(fileUrl) });
  } catch { res.status(500).json({ error: "Could not update track." }); }
});

router.post("/tracks/:id/archive", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const archived = req.body?.archived;
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647 || typeof archived !== "boolean") {
    res.status(400).json({ error: "Valid track ID and archive status required." }); return;
  }
  try {
    const row = await db.transaction(async tx => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(8147, ${id})`);
      const [track] = await tx.update(tracks).set({ archivedAt: archived ? new Date() : null })
        .where(and(eq(tracks.id, id), isNull(tracks.deletedAt))).returning();
      return track;
    });
    if (!row) { res.status(404).json({ error: "Track not found." }); return; }
    const { fileUrl, ...track } = row;
    res.json({ ...track, audioReady: Boolean(fileUrl) });
  } catch { res.status(500).json({ error: "Could not change archive status." }); }
});

router.delete("/tracks/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647 || req.body?.confirm !== "DELETE") {
    res.status(400).json({ error: "Valid track ID and DELETE confirmation required." }); return;
  }
  try {
    const result = await db.transaction(async tx => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(8147, ${id})`);
      const [track] = await tx.select().from(tracks).where(eq(tracks.id, id));
      if (!track || track.deletedAt) return { status: 404, error: "Track not found." };
      if (!track.archivedAt) return { status: 409, error: "Archive this track before deleting it." };
      const history = await tx.execute<{ used: boolean }>(sql`
        SELECT (EXISTS (SELECT 1 FROM orders WHERE track_id = ${id})
          OR EXISTS (SELECT 1 FROM licenses WHERE track_id = ${id})
          OR EXISTS (SELECT 1 FROM transactions WHERE track_id = ${id})) AS used
      `);
      if (history.rows[0]?.used !== false) return { status: 409,
        error: "This track has order or license history. Keep it archived to preserve customer downloads." };
      await tx.update(tracks).set({ deletedAt: new Date() }).where(eq(tracks.id, id));
      // Retain the row and audio for already issued checkouts and shared references.
      return { status: 200, error: "" };
    });
    if (result.error) { res.status(result.status).json({ error: result.error }); return; }
    res.json({ id, deleted: true });
  } catch { res.status(500).json({ error: "Could not delete track." }); }
});

export default router;
