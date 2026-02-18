import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

import { COURTS, getCourtById } from "./courts";
import { TEMPLATES, getTemplateById, SACHVERHALT_START, SACHVERHALT_END } from "./templates";

export default function App() {
  // Common
  const [templateId, setTemplateId] = useState(TEMPLATES[0]?.id || "");
  const tpl = useMemo(() => getTemplateById(templateId), [templateId]);

  const [betreuernName, setBetreuernName] = useState("Serkan Kabakci");

  // Gericht
  const [courtId, setCourtId] = useState(COURTS[0]?.id || "");
  const [courtCustomName, setCourtCustomName] = useState("");
  const [courtCustomAddress, setCourtCustomAddress] = useState("");

  // Pflegekasse
  const [kasseName, setKasseName] = useState("");
  const [kasseAddress, setKasseAddress] = useState("");

  // Betreute Person / Versicherte
  const [betreuteName, setBetreuteName] = useState("");
  const [betreuteGeb, setBetreuteGeb] = useState("");
  const [az, setAz] = useState("");

  const [versName, setVersName] = useState("");
  const [versGeb, setVersGeb] = useState("");
  const [versNr, setVersNr] = useState("");

  // Template-specific
  const [fristBis, setFristBis] = useState("");
  const [sterbeDatum, setSterbeDatum] = useState("");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");

  // Text
  const [sachverhalt, setSachverhalt] = useState("");
  const [output, setOutput] = useState("");

  // KI
  const [loadingKI, setLoadingKI] = useState(false);

  function resolveCourt() {
    if (courtId === "custom") {
      return {
        name: courtCustomName || "[Gericht]",
        address: courtCustomAddress || "[Adresse Gericht]",
      };
    }
    const c = getCourtById(courtId);
    return {
      name: c?.name || "[Gericht]",
      address: (c?.addressLines || ["[Adresse Gericht]"]).join("\n"),
    };
  }

  const buildFields = () => {
    const court = resolveCourt();
    return {
      betreuernName,

      // Gericht
      courtName: court.name,
      courtAddress: court.address,
      az,
      betreuteName,
      betreuteGeb,

      // Pflegekasse
      kasseName,
      kasseAddress,
      versName,
      versGeb,
      versNr,

      // specifics
      fristBis,
      sterbeDatum,
      bankName,
      iban,

      // free
      sachverhalt,
    };
  };

  const generateTemplate = () => {
    const t = getTemplateById(templateId);
    if (!t) return;

    const fields = buildFields();
    const draft = t.build(fields);
    setOutput(draft);
  };

  const optimizeWithKI = async () => {
    if (!output) {
      alert("Bitte zuerst 'Template erzeugen' klicken.");
      return;
    }
    setLoadingKI(true);
    try {
      const r = await fetch("/api/polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: output,
          startMarker: SACHVERHALT_START,
          endMarker: SACHVERHALT_END,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "KI Fehler");
      setOutput(data.draft || output);
    } catch (e) {
      alert(e?.message || String(e));
    } finally {
      setLoadingKI(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const text = output || "Bitte zuerst Template erzeugen.";
    const lines = doc.splitTextToSize(text, 500);
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(lines, 50, 70);
    doc.save("Schriftsatz.pdf");
  };

  const showCourtFields = tpl?.target === "gericht";
  const showKasseFields = tpl?.target === "pflegekasse";

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: 24 }}>
      <motion.h1
        style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Betreuer KI Assistenz – Hybrid (Templates + optionale KI)
      </motion.h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 16,
        }}
      >
        {/* LEFT */}
        <div style={{ background: "white", borderRadius: 16, padding: 16 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ fontWeight: 800 }}>Schreibenstyp</div>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <div style={{ fontWeight: 800, marginTop: 6 }}>Absender</div>
            <input
              value={betreuernName}
              onChange={(e) => setBetreuernName(e.target.value)}
              placeholder="Betreuer Name"
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />

            {showCourtFields && (
              <>
                <div style={{ fontWeight: 800, marginTop: 6 }}>Gericht</div>
                <select
                  value={courtId}
                  onChange={(e) => setCourtId(e.target.value)}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                >
                  {COURTS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                  <option value="custom">Freitext</option>
                </select>

                {courtId === "custom" && (
                  <>
                    <input
                      value={courtCustomName}
                      onChange={(e) => setCourtCustomName(e.target.value)}
                      placeholder="Gericht Name"
                      style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                    />
                    <textarea
                      value={courtCustomAddress}
                      onChange={(e) => setCourtCustomAddress(e.target.value)}
                      placeholder="Gericht Adresse (mehrzeilig)"
                      rows={3}
                      style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                    />
                  </>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input
                    value={az}
                    onChange={(e) => setAz(e.target.value)}
                    placeholder="Aktenzeichen"
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                  />
                  <input
                    value={betreuteGeb}
                    onChange={(e) => setBetreuteGeb(e.target.value)}
                    placeholder="Geburtsdatum (TT.MM.JJJJ)"
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                  />
                </div>

                <input
                  value={betreuteName}
                  onChange={(e) => setBetreuteName(e.target.value)}
                  placeholder="Betreute Person Name"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />
              </>
            )}

            {showKasseFields && (
              <>
                <div style={{ fontWeight: 800, marginTop: 6 }}>Pflegekasse</div>
                <input
                  value={kasseName}
                  onChange={(e) => setKasseName(e.target.value)}
                  placeholder="Pflegekasse Name"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />
                <textarea
                  value={kasseAddress}
                  onChange={(e) => setKasseAddress(e.target.value)}
                  placeholder="Pflegekasse Adresse (mehrzeilig)"
                  rows={3}
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input
                    value={versGeb}
                    onChange={(e) => setVersGeb(e.target.value)}
                    placeholder="Geburtsdatum (TT.MM.JJJJ)"
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                  />
                  <input
                    value={versNr}
                    onChange={(e) => setVersNr(e.target.value)}
                    placeholder="Versichertennummer"
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                  />
                </div>

                <input
                  value={versName}
                  onChange={(e) => setVersName(e.target.value)}
                  placeholder="Versicherte Person Name"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />
              </>
            )}

            {/* Template-specific mini fields */}
            {templateId === "fristverlaengerung" && (
              <input
                value={fristBis}
                onChange={(e) => setFristBis(e.target.value)}
                placeholder="Frist bis (TT.MM.JJJJ)"
                style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
              />
            )}

            {templateId === "todesfall_mitteilung" && (
              <input
                value={sterbeDatum}
                onChange={(e) => setSterbeDatum(e.target.value)}
                placeholder="Sterbedatum (TT.MM.JJJJ)"
                style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
              />
            )}

            {templateId === "neues_bankkonto" && (
              <>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Bank Name"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />
                <input
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="IBAN"
                  style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
                />
              </>
            )}

            <div style={{ fontWeight: 800, marginTop: 6 }}>
              Sachverhalt / Begruendung (frei)
            </div>
            <textarea
              value={sachverhalt}
              onChange={(e) => setSachverhalt(e.target.value)}
              rows={7}
              placeholder="Kurz und konkret. Keine erfundenen Anlagen."
              style={{ padding: 10, borderRadius: 10, border: "1px solid #e5e7eb" }}
            />

            <button
              onClick={generateTemplate}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: 0,
                background: "#111827",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Template erzeugen
            </button>

            <button
              onClick={optimizeWithKI}
              disabled={loadingKI}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: 0,
                background: loadingKI ? "#6b7280" : "#2563eb",
                color: "white",
                fontWeight: 800,
                cursor: loadingKI ? "not-allowed" : "pointer",
              }}
            >
              {loadingKI ? "KI arbeitet..." : "KI optimieren (nur Sachverhalt)"}
            </button>

            <button
              onClick={downloadPDF}
              disabled={!output}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: 0,
                background: !output ? "#93c5fd" : "#0ea5e9",
                color: "white",
                fontWeight: 800,
                cursor: !output ? "not-allowed" : "pointer",
              }}
            >
              PDF herunterladen
            </button>

            <div style={{ fontSize: 12, opacity: 0.75, marginTop: 6 }}>
              Hinweis: Template ist fest. KI aendert nur den markierten Sachverhalt-Teil und darf keine neuen Fakten erfinden.
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ background: "white", borderRadius: 16, padding: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Vorschau</div>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={22}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12,
            }}
          />
        </div>
      </div>
    </div>
  );
}
