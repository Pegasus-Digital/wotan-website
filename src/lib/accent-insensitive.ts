/**
 * Accent-insensitive helpers for Portuguese search (´ ` ^ ~ ç).
 *
 * Payload `@payloadcms/db-mongodb` ≥1.5 escapes regex metacharacters in
 * `contains` (including `[` `]` `|` `()`), so character-class patterns like
 * `[aáàãâä]` become literals and match nothing in production.
 *
 * Instead we expand the query into plain-string variants and OR them via
 * Payload `contains` (substring, case-insensitive).
 */

export function deaccent(value: string): string {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** Common PT-BR diacritics only — keeps OR expansion small enough for long words. */
const ACCENT_VARIANTS: Record<string, string[]> = {
  a: ['a', 'á', 'à', 'ã', 'â'],
  e: ['e', 'é', 'ê'],
  i: ['i', 'í'],
  o: ['o', 'ó', 'õ', 'ô'],
  u: ['u', 'ú'],
  c: ['c', 'ç'],
}

const DEFAULT_MAX_VARIANTS = 64

/** Full-length accent spellings of `value`, capped so OR clauses stay bounded. */
export function expandAccentVariants(
  value: string,
  maxVariants = DEFAULT_MAX_VARIANTS,
): string[] {
  if (!value) return []

  const chars = Array.from(deaccent(value))
  let variants = ['']

  for (const char of chars) {
    const allOptions = ACCENT_VARIANTS[char] ?? [char]
    const options =
      variants.length * allOptions.length <= maxVariants ? allOptions : [char]

    const next: string[] = []
    for (const prefix of variants) {
      for (const option of options) {
        next.push(prefix + option)
      }
    }
    variants = next
  }

  const base = chars.join('')
  return [...new Set(base ? [base, ...variants] : variants)]
}

/**
 * Payload `or` clauses: each field × each accent variant with `contains`.
 * Safe with db-mongodb regex escaping.
 */
export function accentInsensitiveContainsClauses(
  fields: string[],
  value: string,
): Array<Record<string, { contains: string }>> {
  if (!value || fields.length === 0) return []

  return expandAccentVariants(value).flatMap((variant) =>
    fields.map((field) => ({
      [field]: { contains: variant },
    })),
  )
}
