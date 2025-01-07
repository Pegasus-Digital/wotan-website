export function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
}

export function formatBRL(amount: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatBRLWithoutPrefix(value: number) {
  const integerPart = Math.floor(value / 100).toString()
  const decimalPart = (value % 100).toString().padStart(2, '0')
  return `${integerPart},${decimalPart}`
}

export const parseValue = (formattedValue: string) => {
  // Solves edge case - CTRL + A -> Backspace was resulting in NaN,NaN
  if (formattedValue.length === 0) {
    return parseInt('0,00')
  }

  const isNumeric = /^\d+(\,\d+)?$/.test(formattedValue)

  if (!isNumeric) {
    return parseInt('0,00')
  }

  const numericValue = formattedValue.replace(/\D/g, '') // Remove non-numeric characters
  return parseInt(numericValue, 10)
}

export function formatCNPJ(value: string) {
  const unformattedCNPJ = value

  const formattedCNPJ = unformattedCNPJ
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')

  return formattedCNPJ
}

export function formatCPF(value: string) {
  const numericValue = value.replace(/\D/g, '') // Remove tudo que não for número

  return numericValue
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

export function formatPhoneNumber(value: string) {
  const phoneNumber = value // <-- nº de celular não formatado

  const formattedPhoneNumber = phoneNumber
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')

  return formattedPhoneNumber
}
