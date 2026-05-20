export type PrintingTypeOption = {
  value: string
  label: string
}

/** Fallback quando o CMS não tiver tipos configurados */
export const DEFAULT_PRINTING_TYPES: PrintingTypeOption[] = [
  { value: 'serigrafia', label: 'Serigrafia' },
  { value: 'laser', label: 'Laser' },
  { value: 'bordado', label: 'Bordado' },
  { value: 'adesivo', label: 'Aplicação de Adesivo' },
  { value: 'madeira', label: 'Gravação em Madeira' },
  { value: 'tampografia', label: 'Tampografia' },
  { value: 'uv', label: 'Impressão UV' },
]

export function normalizePrintingTypes(
  input?: { value?: string | null; label?: string | null }[] | null,
): PrintingTypeOption[] {
  if (!input?.length) {
    return DEFAULT_PRINTING_TYPES
  }

  const normalized = input
    .filter((item) => item?.value?.trim())
    .map((item) => ({
      value: item.value!.trim(),
      label: (item.label?.trim() || item.value!.trim()) as string,
    }))

  return normalized.length > 0 ? normalized : DEFAULT_PRINTING_TYPES
}

export function resolvePrintingTypeOptions(
  printingTypes: PrintingTypeOption[],
  currentValue?: string | null,
): PrintingTypeOption[] {
  if (!currentValue?.trim()) {
    return printingTypes
  }

  const value = currentValue.trim()
  if (printingTypes.some((option) => option.value === value)) {
    return printingTypes
  }

  return [
    ...printingTypes,
    { value, label: formatPrintingTypeLabel(value, printingTypes) },
  ]
}

export function formatPrintingTypeLabel(
  type?: string | null,
  printingTypes: PrintingTypeOption[] = DEFAULT_PRINTING_TYPES,
): string {
  if (!type?.trim()) {
    return ''
  }

  const value = type.trim()
  const match = printingTypes.find((option) => option.value === value)
  if (match) {
    return match.label
  }

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function printingTypesToLabelMap(
  printingTypes: PrintingTypeOption[],
): Record<string, string> {
  return Object.fromEntries(
    printingTypes.map((option) => [option.value, option.label]),
  )
}
