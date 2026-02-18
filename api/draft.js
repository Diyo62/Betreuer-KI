import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, gericht, az, sachverhalt } = req.body || {};
    const sv = String(sachverhalt || "").trim();

    if (sv.length < 10) {
      return res.status(400).json({ error: "Sachverhalt fehlt oder zu kurz." });
    }

    // 1) Klassifikation (nur Typ + fehlende Pflichtinfos)
    const classify = await client.responses.create({
      model: "gpt-5.2",
      input: [
        {
          role: "system",
          content:
            "Klassifiziere das Anliegen aus dem Sachverhalt. Antworte NUR im JSON Format ohne Zusatztext. Faxfreundlich: schreibe 'Paragraf' statt '§' und 'EUR' statt '€'."
        },
        {
          role: "user",
          content:
            `Sachverhalt:\n${sv}\n\n` +
            `Gib JSON mit Schluesseln aus: case_type, missing_fields.\n` +
            `case_type muss einer der folgenden Werte sein:\n` +
            `TODESFALL_MITTEILUNG, IMMOBILIENVERKAUF_GENEHMIGUNG, UNTERBRINGUNG_1831, ZWANGSMASSNAHME_1832, AUFGABENKREIS_ERWEITERUNG, SONSTIGES.\n` +
            `missing_fields ist ein Array mit fehlenden Pflichtinfos (z.B. Sterbedatum, Sterbeurkunde, Kaufpreis, Grundbuchdaten, Notar, Betreuungsausweis).`
        }
      ],
      text: { format: { type: "json_object" } }
    });

    let classification;
    try {
      classification = JSON.parse(classify.output_text);
    } catch {
      classification = { case_type: "SONSTIGES", missing_fields: [] };
    }

    const caseType = String(classification.case_type || "SONSTIGES");
    const missing = Array.isArray(classification.missing_fields)
      ? classification.missing_fields
      : [];

    // 2) Template je Falltyp
    const templates = {
      TODESFALL_MITTEILUNG: {
        betref: "Mitteilung ueber Todesfall der betreuten Person",
        paragraf: "",
        bodyHint:
          "Mitteilung an das Betreuungsgericht, dass die betreute Person verstorben ist. Bitte um weitere Verfahrensweise / Aufhebung bzw. Abschluss. Hinweis auf Sterbeurkunde als Anlage. Falls erforderlich: Bitte um Entpflichtung und Hinweise zur Schlussrechnung/Schlussbericht."
      },
      IMMOBILIENVERKAUF_GENEHMIGUNG: {
        betref: "Antrag auf Genehmigung zum Verkauf einer Immobilie",
        paragraf: "Paragraf 1821 BGB, Paragraf 1822 BGB",
        bodyHint:
          "Antrag an das Betreuungsgericht auf Genehmigung einer Verfuegung ueber Grundbesitz. Beschreibe Objekt (Adresse/Grundbuch), Gruende (Finanzierung Pflege/Schulden/Erhalt), Kaufpreis/Verkehrswert/Gutachten, Notar, Entwurf Kaufvertrag als Anlage."
      },
      UNTERBRINGUNG_1831: {
        betref: "Antrag auf betreuungsrechtliche Unterbringung",
        paragraf: "Paragraf 1831 BGB",
        bodyHint:
          "Unterbringungsantrag: konkrete Eigen-/Fremdgefaehrdung, Alternativen geprueft, Verhaeltnismaessigkeit, Ort/Klinik, Dauer."
      },
      ZWANGSMASSNAHME_1832: {
        betref: "Antrag auf Genehmigung aerztlicher Zwangsmassnahmen",
        paragraf: "Paragraf 1832 BGB",
        bodyHint:
          "Zwangsmassnahme: medizinische Indikation, fehlende Einwilligungsfaehigkeit, Aufklaerungsversuche, ultima ratio, gerichtliche Genehmigung."
      },
      AUFGABENKREIS_ERWEITERUNG: {
        betref: "Antrag auf Erweiterung des Aufgabenkreises",
        paragraf: "",
        bodyHint:
          "Erweiterung: begruenden, warum neuer Aufgabenkreis erforderlich ist (z.B. Gesundheitsfuersorge/Vermoegenssorge/Wohnungsangelegenheiten)."
      },
      SONSTIGES: {
        betref: "Schreiben an das Betreuungsgericht",
        paragraf: "",
        bodyHint:
          "Allgemeines Schreiben. Sachverhalt klar, Bitte/Antrag klar, Anlagen nennen."
      }
    };

    const t = templates[caseType] || templates.SONSTIGES;

    // 3) Schriftsatz erzeugen (passend zum erkannten Typ)
    const draft = await client.responses.create({
      model: "gpt-5.2",
      input: [
        {
          role: "system",
          content:
            "Du schreibst kurze, gerichtstaugliche Schriftsaetze in Deutsch. Faxfreundlich: keine Sonderzeichen, keine Umlaute wenn moeglich. Nutze 'Paragraf' statt '§'. Struktur: Betreff, Angaben Person/Gericht/AZ, Sachverhalt, Antrag/Bitte, Anlagen, Gruss. Keine Fantasieangaben: wenn Infos fehlen, nutze Platzhalter in eckigen Klammern."
        },
        {
          role: "user",
          content:
            `Betreff-Vorschlag: ${t.betref}\n` +
            `Rechtsgrundlagen (falls passend): ${t.paragraf}\n` +
            `Hinweis: ${t.bodyHint}\n\n` +
            `Daten:\nName: ${name || "[Name]"}\nGericht: ${gericht || "[Gericht]"}\nAZ: ${az || "[AZ]"}\n\n` +
            `Sachverhalt:\n${sv}\n\n` +
            `Fehlende Pflichtinfos: ${missing.length ? missing.join(", ") : "keine"}\n\n` +
            `Erzeuge den Schriftsatz.`
        }
      ]
    });

    return res.status(200).json({
      case_type: caseType,
      missing_fields: missing,
      text: draft.output_text
    });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
