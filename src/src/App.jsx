import React, { useState } from "react";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [name, setName] = useState("");
  const [gericht, setGericht] = useState("");
  const [az, setAz] = useState("");
  const [sachverhalt, setSachverhalt] = useState("");
  const [output, setOutput] = useState("");
  const [name, setName] = useState("");
  const [gericht, setGericht] = useState("");
  const [az, setAz] = useState("");
  const [sachverhalt, setSachverhalt] = useState("");
  const [output, setOutput] = useState("");

  const generateText = () => {
    const text = `Betreff: Antrag auf betreuungsrechtliche Unterbringung\n\n` +
      `Betreute Person: ${name}\n` +
      `Aktenzeichen: ${az}\n\n` +
      `Sehr geehrte Damen und Herren,\n\n` +
      `hiermit beantrage ich als bestellter rechtlicher Betreuer die Genehmigung einer freiheitsentziehenden Unterbringung gemaess Paragraf 1831 BGB.\n\n` +
      `Sachverhalt:\n${sachverhalt}\n\n` +
      `Aufgrund der aktuellen psychischen und gesundheitlichen Situation besteht eine erhebliche Eigen- und Fremdgefaehrdung, sodass die Unterbringung erforderlich und verhaeltnismaessig ist.\n\n` +
      `Ich bitte um kurzfristige gerichtliche Entscheidung.\n\n` +
      `Mit freundlichen Gruessen\n\n` +
      `Der rechtliche Betreuer`;

    setOutput(text);
  };

    return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <motion.h1
        style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Betreuer KI Assistenz – Schriftsatzgenerator (MVP)
      </motion.h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "grid", gap: 10 }}>
            <input
              placeholder="Name betreute Person"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />
            <input
              placeholder="Zustaendiges Gericht"
              value={gericht}
              onChange={(e) => setGericht(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />
            <input
              placeholder="Aktenzeichen"
              value={az}
              onChange={(e) => setAz(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />
            <textarea
              placeholder="Sachverhalt / Gefaehrdung schildern"
              value={sachverhalt}
              onChange={(e) => setSachverhalt(e.target.value)}
              rows={7}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />

            <button
              onClick={() => {
                const text =
                  `Betreff: Antrag auf betreuungsrechtliche Unterbringung

` +
                  `Betreute Person: ${name || "[Name]"}
` +
                  `Zustaendiges Gericht: ${gericht || "[Gericht]"}
` +
                  `Aktenzeichen: ${az || "[AZ]"}

` +
                  `Sehr geehrte Damen und Herren,

` +
                  `hiermit beantrage ich als bestellter rechtlicher Betreuer die Genehmigung einer freiheitsentziehenden Unterbringung gemaess Paragraf 1831 BGB.

` +
                  `Sachverhalt:
${sachverhalt || "[Sachverhalt]"}

` +
                  `Die Unterbringung ist erforderlich und verhaeltnismaessig, um eine erhebliche Eigen- und/oder Fremdgefaehrdung abzuwenden.

` +
                  `Ich bitte um zeitnahe gerichtliche Entscheidung.

` +
                  `Mit freundlichen Gruessen

` +
                  `Serkan Kabakci
Berufsbetreuer`;
                setOutput(text);
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: 0,
                background: "#111827",
                color: "white",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Schriftsatz generieren
            </button>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: "0 6px 18px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Vorschau</div>
          <textarea
            value={output}
            readOnly
            rows={16}
            style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
          />
        </div>
      </div>
    </div>
  );
}

