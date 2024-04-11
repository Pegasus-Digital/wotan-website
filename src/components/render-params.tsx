'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import { toast } from 'sonner'

export type Props = {
  params?: string[]
  onParams?: (paramValues: ((string | null | undefined) | string[])[]) => void
}

const toastTypes = {
  error: toast.error,
  warning: toast.warning,
  success: toast.success,
  message: toast.message,
}

export default function ToasterParams({
  params = ['error', 'warning', 'success', 'message'],
  onParams,
}: Props) {
  const searchParams = useSearchParams()
  const paramValues = params.map((param) => searchParams?.get(param))

  useEffect(() => {
    if (paramValues.length && onParams) {
      onParams(paramValues)
    }

    paramValues.forEach((paramValue, index) => {
      if (paramValue) {
        const toastType = toastTypes[params[index]]
        toastType(paramValue)
      }
    })
  }, [paramValues, onParams])

  return null
}
