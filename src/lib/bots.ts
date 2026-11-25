export type Field = { prop: string; label: string };

export type BotConfig = {
  name: string;
  emoji: string;
  token?: string;
  chatId?: string;
  fields: Field[]; // properti Notion yang ditampilkan (kosong = tampilkan semua)
};

export const BOTS: Record<string, BotConfig> = {
  attendance: {
    name: "Attendance Report",
    emoji: "🕘",
    token: process.env.TELEGRAM_TOKEN_ATTENDANCE,
    chatId: process.env.TELEGRAM_CHAT_ID_ATTENDANCE,
    fields: [
      { prop: "Nama", label: "Nama" },
      { prop: "Status", label: "Status" },
      { prop: "Jam Masuk", label: "Jam Masuk" },
      { prop: "Jam Pulang", label: "Jam Pulang" },
      { prop: "Keterangan", label: "Keterangan" },
    ],
  },
  design: {
    name: "Design Report",
    emoji: "🎨",
    token: process.env.TELEGRAM_TOKEN_DESIGN,
    chatId: process.env.TELEGRAM_CHAT_ID_DESIGN,
    fields: [
      { prop: "Designer", label: "Designer" },
      { prop: "Project", label: "Project" },
      { prop: "Status", label: "Status" },
      { prop: "Deadline", label: "Deadline" },
      { prop: "Link Figma", label: "Link Figma" },
    ],
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