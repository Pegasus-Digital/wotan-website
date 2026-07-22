/**
 * Accent-insensitive helpers for Portuguese search (´ ` ^ ~ ç).
 * Payload `contains` maps to MongoDB `$regex` without escaping, so we can
 * expand base letters into character classes that match accented variants.
 */

export function deaccent(value: string): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const ACCENT_CLASSES: Record<string, string> = {
  a: '[aáàãâä]',
  e: '[eéèêë]',
  i: '[iíìîï]',
  o: '[oóòõôö]',
  u: '[uúùûü]',
  c: '[cç]',
  n: '[nñ]',
}

/** Pattern for Payload `contains` that matches with or without diacritics. */
export function toAccentInsensitivePattern(value: string): string {
  if (!value) return ''

  const escaped = deaccent(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return Array.from(escaped)
    .map((char) => ACCENT_CLASSES[char] ?? char)
    .join('')
}
