import { Metadata } from 'next'

import { EmailTestContent, type SmtpEnvSummary } from './content'

export const metadata: Metadata = {
  title: 'E-mail (SMTP)',
}

function getSmtpSummary(): SmtpEnvSummary {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const fromAddress = process.env.SMTP_EMAIL
  const authUserSet = Boolean(process.env.SMTP_USER)
  const authPassSet = Boolean(process.env.SMTP_PASS)
  const ready = Boolean(
    host && port && fromAddress && authUserSet && authPassSet,
  )

  return {
    ready,
    host,
    port,
    fromAddress,
    authUserSet,
    authPassSet,
  }
}

export default function EmailTestPage() {
  const smtp = getSmtpSummary()
  return <EmailTestContent smtp={smtp} />
}
