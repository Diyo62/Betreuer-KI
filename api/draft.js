import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, gericht, az, sachverhalt } = req.body;

    const completion = await client.responses.create({
      model: "gpt-5.2",
      input: `
Du bist ein Assistent fuer Betreuungsrecht.

Erkenne aus folgendem Sachverhalt das Anliegen und schreibe einen gerichtlichen Schriftsatz.

Moegliche Anliegen:
- Unterbringung Paragraf 1831 BGB
- Zwangsmassnahme Paragraf 1832 BGB
- Todesfall Mitteilung
- Genehmigung Immobilienverkauf
- Aufgabenkreis Erweiterung

Daten:
Name: ${name}
Gericht: ${gericht}
AZ: ${az}

Sachverhalt:
${sachverhalt}

Schreibe einen fertigen Schriftsatz.
Faxfreundlich, ohne Sonderzeichen.
`,
    });

    res.status(200).json({
      text: completion.output_text,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
}
