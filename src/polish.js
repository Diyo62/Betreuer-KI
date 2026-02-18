import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function extractBetween(text, start, end) {
  const s = text.indexOf(start);
  const e = text.indexOf(end);
  if (s === -1 || e === -1 || e <= s) return null;
  return {
    before: text.slice(0, s + start.length),
    middle: text.slice(s + start.length, e),
    after: text.slice(e),
  };
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const { draft, startMarker, endMarker } = req.body || {};
    const full = String(draft || "");

    const markers = extractBetween(full, startMarker, endMarker);
    if (!markers) {
      return res.status(400).json({ error: "Marker nicht gefunden. Bitte Template neu erzeugen." });
    }

    const original = markers.middle.trim();

    const r = await client.responses.create({
      // bewusst guenstig/robust; du kannst spaeter wechseln
      model: "gpt-4.1-mini",
      temperature: 0.2,
      input: [
        {
          role: "system",
          content:
            "Du optimierst NUR den Sachverhaltstext fuer ein offizielles Schreiben. Regeln: Keine neuen Fakten erfinden. Keine neuen Anlagen behaupten. Keine neuen Paragrafen einfuegen. Faxfreundlich: keine Sonderzeichen, moeglichst ohne Umlaute. Ergebnis soll kurz, klar, neutral sein."
        },
        { role: "user", content: `Original-Sachverhalt:\n${original}\n\nOptimierte Version (nur Text, ohne Anrede/Betreff):` }
      ],
    });

    const improved = (r.output_text || "").trim();
    const merged = `${markers.before}\n${improved}\n${markers.after}`;

    return res.status(200).json({ draft: merged });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
