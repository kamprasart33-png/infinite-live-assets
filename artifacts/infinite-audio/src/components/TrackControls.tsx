import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, type Track } from "@/lib/api";

const button = { padding: "7px 11px", borderRadius: 8, border: "1px solid #334155",
  background: "#111827", color: "#e5e7eb", cursor: "pointer" };
const input = { display: "block", width: "100%", marginTop: 5, padding: 10,
  borderRadius: 8, border: "1px solid #334155", background: "#0b1019", color: "white",
  boxSizing: "border-box" as const };

export function TrackControls({ track, onRemoved }: { track: Track; onRemoved: () => void }) {
  const [mode, setMode] = useState<"edit" | "archive" | "delete" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const trigger = useRef<HTMLButtonElement | null>(null);
  const dialog = useRef<HTMLDialogElement | null>(null);
  const pending = useRef(false);
  const query = useQueryClient();
  const archived = Boolean(track.archivedAt);

  useEffect(() => {
    if (mode) dialog.current?.showModal();
    else dialog.current?.close();
  }, [mode]);
  const close = () => { if (!pending.current) { setMode(null); trigger.current?.focus(); } };
  const open = (next: typeof mode, element: HTMLButtonElement) => {
    trigger.current = element; setError(""); setNotice(""); setConfirmation(""); setMode(next);
  };
  const run = async (action: () => Promise<unknown>, message: string, removed = false) => {
    if (pending.current) return;
    pending.current = true; setBusy(true); setError("");
    try {
      await action();
      setNotice(message); setMode(null);
      if (removed) onRemoved();
      await Promise.all([
        query.invalidateQueries({ queryKey: ["tracks"] }),
        query.invalidateQueries({ queryKey: ["store", "tracks"] }),
        query.invalidateQueries({ queryKey: ["metrics", "dashboard"] }),
      ]);
      trigger.current?.focus();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save changes."); }
    finally { pending.current = false; setBusy(false); }
  };

  return <div style={{ marginTop: 12 }}>
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      {archived && <span style={{ color: "#f59e0b", fontSize: 12 }}>Archived</span>}
      <button type="button" style={button} disabled={busy} onClick={e => open("edit", e.currentTarget)}>Edit</button>
      <button type="button" style={button} disabled={busy} onClick={e => open("archive", e.currentTarget)}>{archived ? "Restore" : "Archive"}</button>
      {archived && <button type="button" style={{ ...button, color: "#f87171" }} disabled={busy} onClick={e => open("delete", e.currentTarget)}>Delete</button>}
    </div>
    {notice && <p role="status" style={{ color: "#22c55e", fontSize: 12 }}>{notice}</p>}
    <dialog ref={dialog} aria-label={mode === "edit" ? "Edit track" : mode === "delete" ? "Delete track" : archived ? "Restore track" : "Archive track"}
      onCancel={e => { e.preventDefault(); close(); }}
      style={{ width: "min(430px, calc(100vw - 48px))", maxHeight: "85vh", overflowY: "auto",
        padding: 24, borderRadius: 14, border: "1px solid #334155", background: "#111827", color: "white" }}>
      {mode === "edit" ? <form key={track.id} onSubmit={e => {
        e.preventDefault();
        const fields = new FormData(e.currentTarget);
        const priceCents = Math.round(Number(fields.get("price")) * 100);
        if (!Number.isSafeInteger(priceCents) || priceCents < 0 || priceCents > 2147483647) {
          setError("Enter a valid price."); return;
        }
        void run(() => api.tracks.update(track.id, {
          title: String(fields.get("title") ?? ""), artist: String(fields.get("artist") ?? ""),
          genre: String(fields.get("genre") ?? ""), duration: String(fields.get("duration") ?? ""), priceCents,
        }), "Track updated.");
      }} style={{ display: "grid", gap: 12 }}>
        <h3 style={{ margin: 0 }}>Edit Track</h3>
        <fieldset disabled={busy} style={{ display: "grid", gap: 12, border: 0, padding: 0, margin: 0 }}>
          <label>Title<input autoFocus name="title" defaultValue={track.title} required maxLength={255} style={input} /></label>
          <label>Artist<input name="artist" defaultValue={track.artist} required maxLength={255} style={input} /></label>
          <label>Genre<input name="genre" defaultValue={track.genre ?? ""} maxLength={100} style={input} /></label>
          <label>Duration<input name="duration" defaultValue={track.duration ?? ""} maxLength={20} style={input} /></label>
          <label>Catalog price ($)<input name="price" type="number" min="0" max="21474836.47" step="0.01" defaultValue={(track.priceCents / 100).toFixed(2)} required style={input} /></label>
        </fieldset>
        <p style={{ margin: 0, color: "#9ca3af", fontSize: 12 }}>Checkout license prices are managed separately in Stripe.</p>
        {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" disabled={busy} onClick={close} style={button}>Cancel</button>
          <button type="submit" disabled={busy} style={{ ...button, background: "#06b6d4", color: "black" }}>{busy ? "Saving…" : "Save Changes"}</button>
        </div>
      </form> : mode && <div style={{ display: "grid", gap: 12 }}>
        <h3 style={{ margin: 0 }}>{mode === "delete" ? "Delete Track" : archived ? "Restore Track" : "Archive Track"}</h3>
        <p style={{ margin: 0 }}>{track.title}</p>
        <p style={{ color: "#9ca3af", margin: 0 }}>{mode === "delete"
          ? "Remove this unused track from the library. Tracks with order or license history cannot be deleted. Stored audio is retained."
          : archived ? "Make this track available in the public catalog again."
          : "Hide this track from the public catalog and stop new checkouts. Existing purchases and downloads remain available. Checkouts already started can still complete."}</p>
        {mode === "delete" && <label>Type DELETE to confirm<input autoFocus value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={busy} style={input} /></label>}
        {error && <p role="alert" style={{ color: "#f87171" }}>{error}</p>}
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" autoFocus={mode !== "delete"} disabled={busy} onClick={close} style={button}>Cancel</button>
          <button type="button" disabled={busy || (mode === "delete" && confirmation !== "DELETE")} style={{ ...button, color: mode === "delete" ? "#f87171" : "#22d3ee" }}
            onClick={() => void (mode === "delete" ? run(() => api.tracks.remove(track.id), "Track deleted.", true)
              : run(() => api.tracks.archive(track.id, !archived), archived ? "Track restored." : "Track archived."))}>
            {busy ? "Saving…" : mode === "delete" ? "Delete Track" : archived ? "Restore Track" : "Archive Track"}
          </button>
        </div>
      </div>}
    </dialog>
  </div>;
}
