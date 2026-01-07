/**
 * Normalizes a phone number by removing whitespace and converting +358 to 0.
 */
export const normalizeNumber = (number: string) => {
  const clean = number.replace(/\s+/g, "");
  if (clean.startsWith("+358")) {
    return "0" + clean.slice(4);
  }
  return clean;
};
