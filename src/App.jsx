import React, { useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

export default function App() {
  const [name, setName] = useState("");
  const [gericht, setGericht] = useState("");
  const [az, setAz] = useState("");
  const [sachverhalt, setSachverhalt] = useState("");

  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const [caseType, setCaseType] = useState("");
  const [missing, setMissing] = useState([]);

  const generate = async () => {
    setLoading(true);
    setOutput("");
    setCaseType("");
    setMissing([]);

    try {
      const r = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, gericht, az, sachverhalt })
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "KI Fehler");

      setCaseType(data.case_type || "");
      setMissing(Array.isArray(data.missing_fields) ? data.missing_fields : []);
      setOutput(data.text || "");
    } catch (e) {
      setOutput("FEHLER: " + (e?.message || String(e)));
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const text = output || "Bitte zuerst den Schriftsatz erzeugen.";
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
        Betreuer KI Assistenz – KI erkennt Anliegen automatisch
      </motion.h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 16
        }}
      >
        <div style={{ background: "white", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <input
              placeholder="Name betreute Person (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <input
              placeholder="Zustaendiges Gericht (optional)"
              value={gericht}
              onChange={(e) => setGericht(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <input
              placeholder="Aktenzeichen (optional)"
              value={az}
              onChange={(e) => setAz(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <textarea
              placeholder="Sachverhalt frei schreiben (z.B. Betreuter verstorben / Immobilie verkaufen / Unterbringung...)"
              value={sachverhalt}
              onChange={(e) => setSachverhalt(e.target.value)}
              rows={8}
              style={{
                padding: 10,
                borderRadius: 10,
                border: "1px solid #e5e7eb"
              }}
            />

            <button
              onClick={generate}
              disabled={loading}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: 0,
                background: loading ? "#6b7280" : "#111827",
                color: "white",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer"
              }}
            >
              {loading ? "KI arbeitet..." : "Schriftsatz per KI erzeugen"}
            </button>

            <button
              onClick={downloadPDF}
              disabled={!output || loading}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: 0,
                background: !output || loading ? "#93c5fd" : "#2563eb",
                color: "white",
                fontWeight: 700,
                cursor: !output || loading ? "not-allowed" : "pointer"
              }}
            >
              PDF herunterladen
            </button>

            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
              <div>
                Erkannt: <b>{caseType || "-"}</b>
              </div>
              <div>
                Fehlend:{" "}
                <b>{missing.length ? missing.join(", ") : "-"}</b>
              </div>
            </div>

            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              Hinweis: Faxfreundlich (Paragraf statt Sonderzeichen). Nutzer bleibt verantwortlich fuer Inhalt und Einreichung.
            </div>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Vorschau</div>
          <textarea
            value={output}
            readOnly
            rows={18}
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
