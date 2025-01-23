'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function NewEstimateDialog() {
  return (
    <Button asChild variant='outline' size='sm'>
      <Link href={'/sistema/orcamentos/novo'}>Novo orçamento</Link>
    </Button>
  )
}
