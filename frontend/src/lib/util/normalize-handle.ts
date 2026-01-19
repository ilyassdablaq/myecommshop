/**
 * Normalisiert einen String indem Umlaute durch ASCII-Äquivalente ersetzt werden
 * Küche → kueche, Flur → flur, etc.
 */
export const normalizeHandle = (handle: string): string => {
  return handle
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .trim()
}
