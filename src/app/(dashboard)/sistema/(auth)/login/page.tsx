import React from 'react'
import { Metadata } from 'next'

import { LoginContent } from './content'
import { getSalesUser } from '@/app/_utilities/get-sales-user'

export default async function Login() {
  await getSalesUser({
    validUserRedirect: `/sistema?warning=${encodeURIComponent('Você já está logado.')}`,
  })

  return <LoginContent />

}

export const metadata: Metadata = {
  title: 'Login Sistema',
  description: 'Faça login no sistema.',
}
