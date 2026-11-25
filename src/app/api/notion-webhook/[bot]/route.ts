import { NextRequest, NextResponse } from "next/server";
import { BOTS } from "@/lib/bots";
import { esc, propToText, propToFiles, isImage, renderTemplate, NotionFile } from "@/lib/notion";
export const runtime = "nodejs";
export const maxDuration = 30;

const { WEBHOOK_SECRET } = process.env;
const CAPTION_LIMIT = 1000; // batas Telegram 1024

const api = (token: string, method: string) =>
  `https://api.telegram.org/bot${token}/${method}`;

async function sendText(token: string, chatId: string, text: string) {
  const res = await fetch(api(token, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) console.error("sendMessage:", await res.text());
  return res.ok;
}

// Kirim 1 file: coba lewat URL dulu, kalau gagal download lalu upload langsung
async function sendFile(
  token: string,
  chatId: string,
  file: NotionFile,
  caption?: string
) {
  const photo = isImage(file);
  const method = photo ? "sendPhoto" : "sendDocument";
  const field = photo ? "photo" : "document";

  const byUrl = await fetch(api(token, method), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      [field]: file.url,
      ...(caption ? { caption, parse_mode: "HTML" } : {}),
    }),
  });
  if (byUrl.ok) return true;

  // Fallback: download dari Notion, upload ke Telegram (batas 10 MB untuk foto)
  try {
    const src = await fetch(file.url);
    if (!src.ok) return false;
    const form = new FormData();
    form.append("chat_id", chatId);
    if (caption) {
      form.append("caption", caption);
      form.append("parse_mode", "HTML");
    }
    form.append(field, await src.blob(), file.name);
    const up = await fetch(api(token, method), { method: "POST", body: form });
    if (!up.ok) console.error(`${method} upload:`, await up.text());
    return up.ok;
  } catch (e) {
    console.error("fallback upload gagal:", e);
    return false;
  }
}

// Beberapa gambar sekaligus (album), maksimal 10
async function sendAlbum(
  token: string,
  chatId: string,
  files: NotionFile[],
  caption?: string
) {
  const media = files.slice(0, 10).map((f, i) => ({
    type: "photo",
    media: f.url,
    ...(i === 0 && caption ? { caption, parse_mode: "HTML" } : {}),
  }));
  const res = await fetch(api(token, "sendMediaGroup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, media }),
  });
  if (res.ok) return true;

  console.error("sendMediaGroup:", await res.text());
  // Fallback: kirim satu per satu
  let ok = false;
  for (let i = 0; i < files.length; i++) {
    ok = (await sendFile(token, chatId, files[i], i === 0 ? caption : undefined)) || ok;
  }
  return ok;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bot: string }> }
) {
  const { bot: botKey } = await params;

  if (WEBHOOK_SECRET && req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bot = BOTS[botKey];
  if (!bot) {
    return NextResponse.json({ error: "Bot tidak ditemukan" }, { status: 404 });
  }
  if (!bot.token || !bot.chatId) {
    return NextResponse.json(
      { error: `Token/chat ID untuk ${bot.name} belum diisi` },
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const page = body?.data;
  if (!page?.properties) {
    return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
  }

  // Judul
  let title = "(tanpa judul)";
  for (const prop of Object.values<any>(page.properties)) {
    if (prop.type === "title") {
      title = propToText(prop) ?? title;
      break;
    }
  }

  // Teks properti
  const details: string[] = [];
  if (bot.fields.length > 0) {
    for (const f of bot.fields) {
      const value = propToText(page.properties[f.prop]);
      if (value) details.push(`• <b>${esc(f.label)}</b>: ${esc(value)}`);
    }
  } else {
    for (const [name, prop] of Object.entries<any>(page.properties)) {
      if (prop.type === "title") continue;
      const value = propToText(prop);
      if (value) details.push(`• <b>${esc(name)}</b>: ${esc(value)}`);
    }
  }

  // Semua file dari properti bertipe "files"
  const files: NotionFile[] = Object.values<any>(page.properties).flatMap(
    propToFiles
  );
  const images = files.filter(isImage);
  const others = files.filter((f) => !isImage(f));

// Nilai yang bisa dipakai di template
const values: Record<string, string> = {
  title: esc(title),
  url: page.url ?? "",
  bot: esc(bot.name),
};
for (const [name, prop] of Object.entries<any>(page.properties)) {
  const v = propToText(prop);
  if (v) values[name] = esc(v);
}

const message = bot.template
  ? renderTemplate(bot.template, values)
  : [
      `${bot.emoji} <b>${esc(bot.name)}</b>`,
      `<b>${esc(title)}</b>`,
      "",
      ...details,
      page.url ? `\n<a href="${page.url}">Buka di Notion</a>` : "",
    ].join("\n");
  let ok = true;

  if (images.length === 0) {
    ok = await sendText(bot.token, bot.chatId, message);
  } else {
    // Caption dipakai kalau cukup pendek, kalau tidak teks dikirim terpisah
    const useCaption = message.length <= CAPTION_LIMIT;
    if (!useCaption) ok = await sendText(bot.token, bot.chatId, message);

    const caption = useCaption ? message : undefined;
    ok =
      (images.length === 1
        ? await sendFile(bot.token, bot.chatId, images[0], caption)
        : await sendAlbum(bot.token, bot.chatId, images, caption)) && ok;
  }

  // File non-gambar (pdf, dll) dikirim sebagai dokumen
  for (const f of others) {
    ok = (await sendFile(bot.token, bot.chatId, f)) && ok;
  }

  return NextResponse.json({ ok, images: images.length, files: others.length }, { status: ok ? 200 : 502 });
}