'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'

import { useRouter } from 'next/navigation'

export function NewEstimateDialog() {
  const router = useRouter()
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => router.push('/painel/orcamentos/novo')}
    >
      Novo orçamento
    </Button>
  )
}
