export function getSingular(word: string | undefined): string {
  // Ensure the word is a valid string
  if (!word || typeof word !== 'string') {
    return '' // Handle undefined or invalid input
  }

  // List of common plural suffixes in Portuguese
  const pluralSuffixes: string[] = [
    'ões',
    'ães',
    'ais',
    'eis',
    'óis',
    'is',
    'es',
    's',
  ]

  // Check if the word ends with any of the plural suffixes
  for (const suffix of pluralSuffixes) {
    if (word.endsWith(suffix)) {
      return word.slice(0, -suffix.length) // Return singular form
    }
  }

  return word // If not plural, return the original word
}
