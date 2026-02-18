import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

export default function BetreuerKIAssistenz() {
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
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Betreuer KI Assistenz – Schriftsatzgenerator
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4 space-y-4">
            <Input
              placeholder="Name betreute Person"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Zustaendiges Gericht"
              value={gericht}
              onChange={(e) => setGericht(e.target.value)}
            />

            <Input
              placeholder="Aktenzeichen"
              value={az}
              onChange={(e) => setAz(e.target.value)}
            />

            <Textarea
              placeholder="Sachverhalt / Gefaehrdung schildern"
              value={sachverhalt}
              onChange={(e) => setSachverhalt(e.target.value)}
              className="min-h-[150px]"
            />

            <Button onClick={generateText}>
              Schriftsatz generieren
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-lg">
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Vorschau</h2>
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
