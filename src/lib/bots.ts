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
      "🕘 <b>Absen</b>",
      "",
      "<b>{Nama}</b>_<b>{Status}</b>{status_emoji}",
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
      "<b>{Order Name}</b>",
      "",
      "{Files & Media}",
      "<b>{Order Status}</b>",
      "",
    ].join("\n"),
    fields: [],
  },
  animation: {
    name: "Animation Report",
    emoji: "🎬",
    token: process.env.TELEGRAM_TOKEN_ANIMATION,
    chatId: process.env.TELEGRAM_CHAT_ID_ANIMATION,
    template: [
      "<b>{Order Name}</b>",
      "",
      "{Files & Media}",
      "<b>{Order Status}</b>",
      "",
    ].join("\n"),
    fields: [],
  },
  admin: {
    name: "Admin Report",
    emoji: "🗂️",
    token: process.env.TELEGRAM_TOKEN_ADMIN,
    chatId: process.env.TELEGRAM_CHAT_ID_ADMIN,
    template: [
      "<b>{Order Name}</b>",
      "",
      "{Files & Media}",
      "<b>{Order Status}</b>",
      "",
    ].join("\n"),
    fields: [],
  },
  programmer: {
    name: "Programmer Report",
    emoji: "💻",
    token: process.env.TELEGRAM_TOKEN_PROGRAMMER,
    chatId: process.env.TELEGRAM_CHAT_ID_PROGRAMMER,
    template: [
      "<b>{Order Name}</b>",
      "",
      "{Files & Media}",
      "<b>{Order Status}</b>",
      "",
    ].join("\n"),
    fields: [],
  },
};

