import type { FieldHook } from 'payload/types'

function format(texto: string): string {
  const substituicoes: { [key: string]: string } = {
    á: 'a',
    à: 'a',
    ã: 'a',
    â: 'a',
    é: 'e',
    è: 'e',
    ê: 'e',
    í: 'i',
    ì: 'i',
    î: 'i',
    ó: 'o',
    ò: 'o',
    õ: 'o',
    ô: 'o',
    ú: 'u',
    ù: 'u',
    û: 'u',
    ç: 'c',
  }

  return texto
    .toLowerCase()
    .trim()
    .replace(/[áàãâéèêíìîóòõôúùûç]/g, (char) => substituicoes[char] || char)
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const formatSlug =
  (fallback: string): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create') {
      const fallbackData = data?.[fallback] || originalDoc?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return format(fallbackData)
      }
    }

    return value
  }

const formatSlugProduct =
  (): FieldHook =>
  ({ operation, value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }

    if (operation === 'create') {
      const skuSlug = data?.['title'] + '-' + data?.['sku']

      if (skuSlug && typeof skuSlug === 'string') {
        return format(skuSlug)
      }
    }

    return value
  }

export { formatSlug, formatSlugProduct }
