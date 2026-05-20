'use client'

import { useEffect, useState } from 'react'

import {
  DEFAULT_PRINTING_TYPES,
  PrintingTypeOption,
} from '@/lib/printing-types'

let cachedPrintingTypes: PrintingTypeOption[] | null = null
let fetchPromise: Promise<PrintingTypeOption[]> | null = null

export function invalidatePrintingTypesCache() {
  cachedPrintingTypes = null
  fetchPromise = null
}

function fetchPrintingTypes(): Promise<PrintingTypeOption[]> {
  if (cachedPrintingTypes) {
    return Promise.resolve(cachedPrintingTypes)
  }

  if (!fetchPromise) {
    fetchPromise = fetch('/api/printing-types')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load printing types')
        }
        return response.json() as Promise<PrintingTypeOption[]>
      })
      .then((types) => {
        cachedPrintingTypes = types
        return types
      })
      .catch(() => DEFAULT_PRINTING_TYPES)
  }

  return fetchPromise
}

export function usePrintingTypes() {
  const [printingTypes, setPrintingTypes] = useState<PrintingTypeOption[]>(
    cachedPrintingTypes ?? DEFAULT_PRINTING_TYPES,
  )

  useEffect(() => {
    let cancelled = false

    fetchPrintingTypes().then((types) => {
      if (!cancelled) {
        setPrintingTypes(types)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return printingTypes
}
