import { BOTS } from "@/lib/bots";

export default function Home() {
  return (
    <main style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>Notion → Telegram Webhook</h1>
      <ul>
        {Object.entries(BOTS).map(([key, bot]) => (
          <li key={key}>
            {bot.emoji} {bot.name}: <code>/api/notion-webhook/{key}</code>
          </li>
        ))}
      </ul>
    </main>
  );
}