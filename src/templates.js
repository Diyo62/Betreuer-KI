// Faxfreundlich: keine Sonderzeichen, "Paragraf" statt §, "EUR" statt €.

function todayDE() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

// Markers: KI darf nur SACHVERHALT optimieren
export const SACHVERHALT_START = "<<SACHVERHALT_START>>";
export const SACHVERHALT_END = "<<SACHVERHALT_END>>";

export const TEMPLATES = [
  {
    id: "pflegegrad_erstantrag",
    label: "Pflegekasse: Antrag Pflegegrad (Erstbegutachtung)",
    target: "pflegekasse",
    required: ["kasseName", "versName", "versGeb", "versNr", "sachverhalt"],
    build: (f) => {
      return (
        `${f.kasseName || "[Pflegekasse]"}\n` +
        `${f.kasseAddress || "[Adresse Pflegekasse]"}\n\n` +
        `Datum: ${todayDE()}\n\n` +
        `Betreff: Antrag auf Feststellung eines Pflegegrades / Erstbegutachtung\n\n` +
        `Versicherte Person: ${f.versName || "[Name]"}, geb. ${f.versGeb || "[TT.MM.JJJJ]"}\n` +
        `Versichertennummer: ${f.versNr || "[Nummer]"}\n\n` +
        `Sehr geehrte Damen und Herren,\n\n` +
        `hiermit stelle ich einen Antrag auf Feststellung eines Pflegegrades sowie auf zeitnahe Begutachtung.\n\n` +
        `Sachverhalt:\n` +
        `${SACHVERHALT_START}\n${f.sachverhalt || "[Sachverhalt]"}\n${SACHVERHALT_END}\n\n` +
        `Bitte bestaetigen Sie den Antragseingang und teilen Sie mir den weiteren Ablauf (Begutachtungstermin) mit.\n\n` +
        `Mit freundlichen Gruessen\n\n` +
        `${f.betreuernName || "Serkan Kabakci"}\n` +
        `Berufsbetreuer\n`
      );
    },
  },

  {
    id: "pflegegrad_hoeherstufung",
    label: "Pflegekasse: Antrag Hoeherstufung / Neubegutachtung",
    target: "pflegekasse",
    required: ["kasseName", "versName", "versGeb", "versNr", "sachverhalt"],
    build: (f) => {
      return (
        `${f.kasseName || "[Pflegekasse]"}\n` +
        `${f.kasseAddress || "[Adresse Pflegekasse]"}\n\n` +
        `Datum: ${todayDE()}\n\n` +
        `Betreff: Antrag auf Hoeherstufung / Neubegutachtung Pflegegrad\n\n` +
        `Versicherte Person: ${f.versName || "[Name]"}, geb. ${f.versGeb || "[TT.MM.JJJJ]"}\n` +
        `Versichertennummer: ${f.versNr || "[Nummer]"}\n\n` +
        `Sehr geehrte Damen und Herren,\n\n` +
        `hiermit beantrage ich eine Neubegutachtung, da sich der Hilfebedarf erhoeht hat.\n\n` +
        `Sachverhalt:\n` +
        `${SACHVERHALT_START}\n${f.sachverhalt || "[Sachverhalt]"}\n${SACHVERHALT_END}\n\n` +
        `Bitte bestaetigen Sie den Antragseingang und teilen Sie mir einen Begutachtungstermin mit.\n\n` +
        `Mit freundlichen Gruessen\n\n` +
        `${f.betreuernName || "Serkan Kabakci"}\n` +
        `Berufsbetreuer\n`
      );
    },
  },

  {
    id: "ak_erweiterung",
    label: "Betreuungsgericht: Antrag Aufgabenkreis erweitern",
    target: "gericht",
    required: ["courtName", "courtAddress", "az", "betreuteName", "betreuteGeb", "sachverhalt"],
    build: (f) => {
      return (
        `${f.courtName || "[Gericht]"}\n` +
        `${f.courtAddress || "[Adresse Gericht]"}\n\n` +
        `Datum: ${todayDE()}\n\n` +
        `Az.: ${f.az || "[AZ]"}\n` +
        `Betreute Person: ${f.betreuteName || "[Name]"}, geb. ${f.betreuteGeb || "[TT.MM.JJJJ]"}\n\n` +
        `Betreff: Antrag auf Erweiterung des Aufgabenkreises\n\n` +
        `Sehr geehrte Damen und Herren,\n\n` +
        `ich beantrage die Erweiterung des Aufgabenkreises, da die aktuelle Aufgabenabgrenzung zur ordnungsgemaessen Wahrnehmung der Betreuung nicht ausreicht.\n\n` +
        `Sachverhalt:\n` +
        `${SACHVERHALT_START}\n${f.sachverhalt || "[Sachverhalt]"}\n${SACHVERHALT_END}\n\n` +
        `Beantragt wird die Aufnahme folgender Aufgabenkreise (bitte konkretisieren):\n` +
        `- [z.B. Gesundheitsfuersorge]\n- [z.B. Vermoegenssorge]\n- [z.B. Wohnungsangelegenheiten]\n\n` +
        `Mit freundlichen Gruessen\n\n` +
        `${f.betreuernName || "Serkan Kabakci"}\n` +
        `Berufsbetreuer\n`
      );
    },
  },

  {
    id: "ak_aufhebung",
    label: "Betreuungsgericht: Antrag Aufhebung/Reduzierung Aufgabenkreis",
    target: "gericht",
    required: ["courtName", "courtAddress", "az", "betreuteName", "betreuteGeb", "sachverhalt"],
    build: (f) => {
      return (
        `${f.courtName || "[Gericht]"}\n` +
        `${f.courtAddress || "[Adresse Gericht]"}\n\n` +
        `Datum: ${todayDE()}\n\n` +
        `Az.: ${f.az || "[AZ]"}\n` +
        `Betreute Person: ${f.betreuteName || "[Name]"}, geb. ${f.betreuteGeb || "[TT.MM.JJJJ]"}\n\n` +
        `Betreff: Antrag auf Aufhebung / Reduzierung des Aufgabenkreises\n\n` +
        `Sehr geehrte Damen und Herren,\n\n` +
        `ich beantrage die Aufhebung bzw. Reduzierung des Aufgabenkreises, da die Voraussetzungen fuer eine Betreuung in diesem Umfang nicht mehr vorliegen.\n\n` +
        `Sachverhalt:\n` +
        `${SACHVERHALT_START}\n${f.sachverhalt || "[Sachverhalt]"}\n${SACHVERHALT_END}\n\n` +
        `Mit freundlichen Gruessen\n\n` +
        `${f.betreuernName || "Serkan Kabakci"}\n` +
        `Berufsbetreuer\n`
      );
    },
  },

  {
    id: "fristverlaengerung",
    label: "Betreuungsgericht: Antrag Fristverlaengerung",
    target: "gericht",
    required: ["courtName", "courtAddress", "az", "betreuteName", "betreuteGeb", "fristBis", "sachverhalt"],
    build: (f) => {
      return (
        `${f.courtName || "[Gericht]"}\n` +
        `${f.courtAddress || "[Adresse Gericht]"}\n\n` +
        `Datum: ${todayDE()}\n\n` +
        `Az.: ${f.az || "[AZ]"}\n` +
        `Betreute Person: ${f.betreuteName || "[Name]"}, geb. ${f.betreuteGeb || "[TT.MM.JJJJ]"}\n\n` +
        `Betreff: Antrag auf Fristverlaengerung\n\n` +
        `Sehr geehrte Damen und Herren,\n\n` +
        `ich beantrage eine Fristverlaengerung bis zum ${f.fristBis || "[TT.MM.JJJJ]"}.\n\n` +
        `Begruendung:\n` +
        `${SACHVERHALT_START}\n${f.sachverhalt || "[Begruendung]"}\n${SACHVERHALT_END}\n\n` +
        `Mit freundlichen Gruessen\n\n` +
        `${f.betreuernName || "Serkan Kabakci"}\n` +
        `Berufsbetreuer\n`
      );
    },
  },

  {
    id: "todesfall_mitteilung",
    label: "Betreuungsgericht: Mitteilung Todesfall (Sterbeurkunde)",
    target: "gericht",
    required: ["courtName", "courtAddress", "az", "betreuteName", "betreuteGeb", "sterbeDatum"],
    build: (f) => {
      return (
        `${f.courtName || "[Gericht]"}\n` +
        `${f.courtAddress || "[Adresse Gericht]"}\n\n` +
        `Datum: ${todayDE()}\n\n` +
        `Az.: ${f.az || "[AZ]"}\n` +
        `Betreute Person: ${f.betreuteName || "[Name]"}, geb. ${f.betreuteGeb || "[TT.MM.JJJJ]"}\n\n` +
        `Betreff: Mitteilung ueber Todesfall der betreuten Person\n\n` +
        `Sehr geehrte Damen und Herren,\n\n` +
        `hiermit teile ich mit, dass die betreute Person am ${f.sterbeDatum || "[TT.MM.JJJJ]"} verstorben ist.\n\n` +
        `Anlage: Sterbeurkunde (sofern bereits vorhanden / wird nachgereicht).\n\n` +
        `Ich bitte um kurze Mitteilung zur weiteren Verfahrensweise (Abschluss / Entpflichtung) sowie zu ggf. erforderlichen Nachweisen.\n\n` +
        `Mit freundlichen Gruessen\n\n` +
        `${f.betreuernName || "Serkan Kabakci"}\n` +
        `Berufsbetreuer\n`
      );
    },
  },

  {
    id: "neues_bankkonto",
    label: "Betreuungsgericht: Mitteilung neues Bankkonto / Kontowechsel",
    target: "gericht",
    required: ["courtName", "courtAddress", "az", "betreuteName", "betreuteGeb", "bankName", "iban"],
    build: (f) => {
      return (
        `${f.courtName || "[Gericht]"}\n` +
        `${f.courtAddress || "[Adresse Gericht]"}\n\n` +
        `Datum: ${todayDE()}\n\n` +
        `Az.: ${f.az || "[AZ]"}\n` +
        `Betreute Person: ${f.betreuteName || "[Name]"}, geb. ${f.betreuteGeb || "[TT.MM.JJJJ]"}\n\n` +
        `Betreff: Mitteilung neues Bankkonto / Kontowechsel\n\n` +
        `Sehr geehrte Damen und Herren,\n\n` +
        `hiermit teile ich mit, dass fuer die betreute Person ein Bankkonto eingerichtet bzw. ein Kontowechsel vorgenommen wurde.\n\n` +
        `Bank: ${f.bankName || "[Bank]"}\n` +
        `IBAN: ${f.iban || "[IBAN]"}\n\n` +
        `Anlage: Bankbestaetigung / Kontoeroeffnungsbestaetigung (sofern vorhanden / wird nachgereicht).\n\n` +
        `Mit freundlichen Gruessen\n\n` +
        `${f.betreuernName || "Serkan Kabakci"}\n` +
        `Berufsbetreuer\n`
      );
    },
  },
];

export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === id) || null;
}
