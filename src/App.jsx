import React, { useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

export default function App() {
  const [name, setName] = useState("");
  const [gericht, setGericht] = useState("");
  const [az, setAz] = useState("");
  const [sachverhalt, setSachverhalt] = useState("");
  const [output, setOutput] = useState("");

  const generate = () => {
    const text =
      `Betreff: Antrag auf betreuungsrechtliche Unterbringung\n\n` +
      `Betreute Person: ${name || "[Name]"}\n` +
      `Zustaendiges Gericht: ${gericht || "[Gericht]"}\n` +
      `Aktenzeichen: ${az || "[AZ]"}\n\n` +
      `Sehr geehrte Damen und Herren,\n\n` +
      `hiermit beantrage ich als bestellter rechtlicher Betreuer die Genehmigung einer freiheitsentziehenden Unterbringung gemaess Paragraf 1831 BGB.\n\n` +
      `Sachverhalt:\n${sachverhalt || "[Sachverhalt]"}\n\n` +
      `Die Unterbringung ist erforderlich und verhaeltnismaessig, um eine erhebliche Eigen- und/oder Fremdgefaehrdung abzuwenden.\n\n` +
      `Ich bitte um zeitnahe gerichtliche Entscheidung.\n\n` +
      `Mit freundlichen Gruessen\n\n` +
      `Serkan Kabakci\nBerufsbetreuer`;

    setOutput(text);
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
