import React from 'react'
import { Metadata } from 'next'

import { LoginContent } from './content'
import { getAdminUser } from '@/app/_utilities/get-admin-user'

export default async function Login() {
  await getAdminUser({
    validUserRedirect: `/painel?warning=${encodeURIComponent('Você já está logado.')}`,
  })

  return (
    <>
      <LoginContent />
    </>
  )
}

export const metadata: Metadata = {
  title: 'Login Administrador',
  description: 'Faça login no painel de administrador.',
}
