import React, { useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

export default function App() {
  const [name, setName] = useState("");
  const [gericht, setGericht] = useState("");
  const [az, setAz] = useState("");
  const [sachverhalt, setSachverhalt] = useState("");
  const [output, setOutput] = useState("");

 const generate = async () => {
  const r = await fetch("/api/draft", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      gericht,
      az,
      sachverhalt,
    }),
  });

  const data = await r.json();
  setOutput(data.text || "Fehler bei KI");
};

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const text = output || "Bitte zuerst den Schriftsatz generieren.";
    const lines = doc.splitTextToSize(text, 500);

    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(lines, 50, 70);

    doc.save("Schriftsatz.pdf");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 24 }}>
      <motion.h1
        style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Betreuer KI Assistenz – Schriftsatzgenerator
      </motion.h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16
        }}
      >
        <div style={{ background: "white", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <input
              placeholder="Name betreute Person"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <input
              placeholder="Zustaendiges Gericht"
              value={gericht}
              onChange={(e) => setGericht(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <input
              placeholder="Aktenzeichen"
              value={az}
              onChange={(e) => setAz(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <textarea
              placeholder="Sachverhalt / Gefaehrdung schildern"
              value={sachverhalt}
              onChange={(e) => setSachverhalt(e.target.value)}
              rows={7}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <button
              onClick={generate}
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

            <button
              onClick={downloadPDF}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: 0,
                background: "#2563eb",
                color: "white",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              PDF herunterladen
            </button>
          </div>
        </div>

                <div style={{ background: "white", borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Vorschau</div>
          <textarea
            value={output}
            readOnly
            rows={16}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #e5e7eb"
            }}
          />
        </div>
      </div>
    </div>
  );
}
