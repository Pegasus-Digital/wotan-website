export function getSingular(word: string): string {
  // List of common plural suffixes in Portuguese
  const pluralSuffixes: string[] = [
    's',
    'es',
    'ões',
    'ães',
    'ais',
    'eis',
    'óis',
    'is',
  ]

  // Check if the word ends with any of the plural suffixes
  for (const suffix of pluralSuffixes) {
    if (word.endsWith(suffix)) {
      return word.slice(0, -suffix.length) // Return singular form
    }
  }
  return word // If not plural, return the original word
}
