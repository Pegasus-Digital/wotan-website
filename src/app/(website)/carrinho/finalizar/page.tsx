import { Metadata } from 'next'
import { FinishContent } from './content'

export const metadata: Metadata = {
  title: 'Finalizar',
}

export default async function Finish() {
  return <FinishContent />
}
