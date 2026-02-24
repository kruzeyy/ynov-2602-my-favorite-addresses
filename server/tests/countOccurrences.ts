/**
 * Compte le nombre d'occurrences d'un mot dans un texte (insensible à la casse).
 * Séparé de l'API pour pouvoir être testé unitairement si besoin.
 */
export function countOccurrences(text: string, word: string): number {
  if (!word.trim()) return 0;
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}
