import React from 'react'
import { Metadata } from 'next'

import { LoginContent } from './content'
import { getAdminUser } from '@/app/_utilities/get-admin-user'

export default async function Login() {
  await getAdminUser({
    validUserRedirect: `/sistema?warning=${encodeURIComponent('Você já está logado.')}`,
  })

  return (
    <>
      <LoginContent />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Login Sistema',
  description: 'Faça login no sistema.',
}
