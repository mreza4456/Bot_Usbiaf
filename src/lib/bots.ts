export type Field = { prop: string; label: string };

export type BotConfig = {
  name: string;
  emoji: string;
  token?: string;
  chatId?: string;
  template?: string; // opsional
  fields: Field[];
};
export const BOTS: Record<string, BotConfig> = {
  attendance: {
    name: "Attendance Report",
    emoji: "🕘",
    token: process.env.TELEGRAM_TOKEN_ATTENDANCE,
    chatId: process.env.TELEGRAM_CHAT_ID_ATTENDANCE,
    template: [
      "🕘 <b>Attendance Report</b>",
      "",
      "👤 <b>{Nama}</b>",
      "<b>{Status}</b> {status_emoji}",
      "{Waktu Online}",
      "{Waktu Offline}",
      "",
    ].join("\n"),
    fields: [],
  },
  design: {
    name: "Design Report",
    emoji: "🎨",
    token: process.env.TELEGRAM_TOKEN_DESIGN,
    chatId: process.env.TELEGRAM_CHAT_ID_DESIGN,
    template: [
      "🎨 <b>Design Report</b>",
      "",
      "<b>{title}</b>",
      "Designer: {Designer}",
      "Project: {Project}",
      "Status: <b>{Status}</b>",
      "Deadline: {Deadline}",
      "",
      '<a href="{url}">Buka di Notion</a>',
    ].join("\n"),
    fields: [],
  },
  animation: {
    name: "Animation Report",
    emoji: "🎬",
    token: process.env.TELEGRAM_TOKEN_ANIMATION,
    chatId: process.env.TELEGRAM_CHAT_ID_ANIMATION,
    fields: [
      { prop: "Animator", label: "Animator" },
      { prop: "Scene", label: "Scene" },
      { prop: "Progress", label: "Progress" },
      { prop: "Status", label: "Status" },
      { prop: "Deadline", label: "Deadline" },
    ],
  },
  admin: {
    name: "Admin Report",
    emoji: "🗂️",
    token: process.env.TELEGRAM_TOKEN_ADMIN,
    chatId: process.env.TELEGRAM_CHAT_ID_ADMIN,
    fields: [
      { prop: "PIC", label: "PIC" },
      { prop: "Kategori", label: "Kategori" },
      { prop: "Status", label: "Status" },
      { prop: "Tanggal", label: "Tanggal" },
      { prop: "Catatan", label: "Catatan" },
    ],
  },
  programmer: {
    name: "Programmer Report",
    emoji: "💻",
    token: process.env.TELEGRAM_TOKEN_PROGRAMMER,
    chatId: process.env.TELEGRAM_CHAT_ID_PROGRAMMER,
    fields: [
      { prop: "Developer", label: "Developer" },
      { prop: "Task", label: "Task" },
      { prop: "Prioritas", label: "Prioritas" },
      { prop: "Status", label: "Status" },
      { prop: "Branch / PR", label: "Branch / PR" },
    ],
  },
};

