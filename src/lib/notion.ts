export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function propToText(p: any): string | null {
  switch (p?.type) {
    case "title":
      return p.title.map((t: any) => t.plain_text).join("") || null;
    case "rich_text":
      return p.rich_text.map((t: any) => t.plain_text).join("") || null;
      case "number": {
      if (p.number == null) return null;
      const isPercent = p.__name?.includes("%"); // tidak dipakai, lihat catatan
      return String(p.number);
    }
    case "select":
      return p.select?.name ?? null;
    case "status":
      return p.status?.name ?? null;
    case "multi_select":
      return p.multi_select.map((s: any) => s.name).join(", ") || null;
       case "date":
      if (!p.date) return null;
      return p.date.end
        ? `${fmtTime(p.date.start)} → ${fmtTime(p.date.end)}`
        : fmtTime(p.date.start);
    case "created_time":
      return fmtTime(p.created_time);
    case "last_edited_time":
      return fmtTime(p.last_edited_time);
    case "checkbox":
      return p.checkbox ? "✅" : "❌";
    case "people":
      return p.people.map((u: any) => u.name ?? u.id).join(", ") || null;
    case "url":
    case "email":
          case "rollup": {
      const r = p.rollup;
      if (!r) return null;
      if (r.type === "number") return r.number != null ? String(r.number) : null;
      if (r.type === "date") return fmtTime(r.date?.start);
      if (r.type === "array") {
        const items = (r.array ?? []).map((x: any) => propToText(x)).filter(Boolean);
        return items.length ? items.join(", ") : null;
      }
      return null;
    }
    case "phone_number":
      return p[p.type] ?? null;
    case "formula": {
      const f = p.formula;
      return f?.[f.type] != null ? String(f[f.type]) : null;
    }
    default:
      return null;
  }
}


export type NotionFile = { name: string; url: string };

// Ambil semua file dari properti bertipe "files"
export function propToFiles(p: any): NotionFile[] {
  if (p?.type !== "files") return [];
  return (p.files ?? [])
    .map((f: any) => ({
      name: f.name ?? "file",
      url: f.type === "file" ? f.file?.url : f.external?.url,
    }))
    .filter((f: NotionFile) => !!f.url);
}

export const isImage = (f: NotionFile) =>
  /\.(jpe?g|png|webp)$/i.test(f.name) ||
  /\.(jpe?g|png|webp)(\?|$)/i.test(f.url.split("?")[0] + "?");


  // Ganti {Nama Kolom} dengan nilainya.
// Baris yang semua placeholder-nya kosong akan dihapus.
export function renderTemplate(
  template: string,
  values: Record<string, string>
) {
  return template
    .split("\n")
    .filter((line) => {
      const keys = [...line.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
      return keys.length === 0 || keys.some((k) => values[k]);
    })
    .map((line) =>
      line.replace(/\{([^}]+)\}/g, (_, k) => values[k] || "-")
    )
    .join("\n");
}


const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

// "2026-11-25T13:27:00.000+07:00" -> "Rabu, 25 Nov 2026 • 13:27"
// "2026-11-25" (tanpa jam)        -> "Rabu, 25 Nov 2026"
export function fmtTime(iso?: string | null) {
  if (!iso) return null;

  const hasTime = iso.includes("T");

  // Tanggal tanpa jam: jangan dikonversi zona waktu supaya hari tidak bergeser
  const d = hasTime ? new Date(iso) : new Date(`${iso}T00:00:00+07:00`);
  if (isNaN(d.getTime())) return iso;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(d);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";

  // Nama hari dihitung dari tanggal WIB
  const wibDate = new Date(
    Date.UTC(Number(get("year")), Number(get("month")) - 1, Number(get("day")))
  );
  const hari = HARI[wibDate.getUTCDay()];
  const bulan = BULAN[Number(get("month")) - 1];

  const tanggal = `${hari}, ${Number(get("day"))} ${bulan} ${get("year")}`;
  const jam = `${get("hour").replace("24", "00")}:${get("minute")}`;

  return hasTime ? `${tanggal} • ${jam}` : tanggal;
}

// "@MReza" -> "MReza"
export const stripAt = (s?: string | null) =>
  s ? s.replace(/^@+/, "").trim() : s ?? "";

const STATUS_EMOJI: Record<string, string> = {
  ONLINE: "✅",
  OFFLINE: "❌",
  IZIN: "🟡",
  SAKIT: "🟠",
};


export const statusEmoji = (s?: string) =>
  (s && STATUS_EMOJI[s.trim().toUpperCase()]) || "⚪";



// 0.25 -> "25%", 0.5 -> "50%", 0.125 -> "12.5%", 1 -> "100%"
export const toPercent = (v?: string | number | null) => {
  if (v == null || v === "") return "";
  const n = Number(v);
  if (isNaN(n)) return String(v);
  return `${Math.round(n * 10000) / 100}%`;
};

