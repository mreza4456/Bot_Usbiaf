export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function propToText(p: any): string | null {
  switch (p?.type) {
    case "title":
      return p.title.map((t: any) => t.plain_text).join("") || null;
    case "rich_text":
      return p.rich_text.map((t: any) => t.plain_text).join("") || null;
    case "number":
      return p.number != null ? String(p.number) : null;
    case "select":
      return p.select?.name ?? null;
    case "status":
      return p.status?.name ?? null;
    case "multi_select":
      return p.multi_select.map((s: any) => s.name).join(", ") || null;
    case "date":
      if (!p.date) return null;
      return p.date.end ? `${p.date.start} → ${p.date.end}` : p.date.start;
    case "checkbox":
      return p.checkbox ? "✅" : "❌";
    case "people":
      return p.people.map((u: any) => u.name ?? u.id).join(", ") || null;
    case "url":
    case "email":
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