export const COURTS = [
  {
    id: "ag_loerrach",
    name: "Amtsgericht Loerrach",
    addressLines: ["Bahnhofstrasse 4", "79539 Loerrach"],
    fax: "07621/408-180",
  },
  {
    id: "ag_schopfheim",
    name: "Amtsgericht Schopfheim",
    addressLines: ["Hauptstrasse 16", "79650 Schopfheim"],
    fax: "07622/6777-67",
  },
  {
    id: "ag_muellheim",
    name: "Amtsgericht Muellheim",
    addressLines: ["Werderstrasse 37", "79379 Muellheim"],
    fax: "0711/8968821194",
  },
];

export function getCourtById(id) {
  return COURTS.find((c) => c.id === id) || null;
}
