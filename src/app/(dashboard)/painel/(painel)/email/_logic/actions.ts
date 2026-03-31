'use server'

import payload from 'payload'

import { getPayloadClient } from '@/lib/get-payload'
import { ActionResponse } from '@/lib/actions'

const FROM_NAME = 'Wotan Email Service'

function smtpEnvReady(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_EMAIL &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  )
}

interface VerifySmtpResponseData {
  verifiedAt: string
}

/** Nodemailer `verify()`: conecta e autentica no SMTP sem enviar mensagem. */
export async function verifySmtpTransport(): Promise<
  ActionResponse<VerifySmtpResponseData | null>
> {
  if (!smtpEnvReady()) {
    return {
      data: null,
      status: false,
      message:
        'SMTP não está configurado no ambiente (SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_USER, SMTP_PASS).',
    }
  }

  try {
    const p = await getPayloadClient()
    const email = await p.email
    await email.transport.verify()
    const verifiedAt = new Date().toISOString()
    return {
      data: { verifiedAt },
      status: true,
      message:
        'Conexão e autenticação SMTP OK. Nenhum e-mail foi enviado (apenas verificação).',
    }
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Falha desconhecida na verificação SMTP.'
    return {
      data: null,
      status: false,
      message: `[SMTP] ${msg}`,
    }
  }
}

interface SendSmtpTestEmailResponseData {
  sentAt: string
}

export async function sendSmtpTestEmail(
  recipientEmail: string,
): Promise<ActionResponse<SendSmtpTestEmailResponseData | null>> {
  const trimmed = recipientEmail.trim()
  if (!trimmed) {
    return {
      data: null,
      status: false,
      message: 'Informe um endereço de e-mail.',
    }
  }

  if (!smtpEnvReady()) {
    return {
      data: null,
      status: false,
      message:
        'SMTP não está configurado no ambiente (SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_USER, SMTP_PASS).',
    }
  }

  const fromAddress = process.env.SMTP_EMAIL as string
  const sentAt = new Date().toISOString()

  try {
    await payload.sendEmail({
      from: `${FROM_NAME} <${fromAddress}>`,
      to: trimmed,
      subject: 'Teste SMTP — Wotan Brindes',
      html: `
        <p>Este é um e-mail de teste enviado pelo painel administrativo.</p>
        <p>Se você recebeu esta mensagem, o SMTP da plataforma está funcionando.</p>
        <p style="color:#666;font-size:12px;margin-top:24px;">Enviado em ${sentAt}</p>
      `,
    })

    return {
      data: { sentAt },
      status: true,
      message: 'E-mail de teste enviado. Verifique a caixa de entrada (e o spam).',
    }
  } catch (err) {
    const msg =
      err instanceof Error ? err.message : 'Falha desconhecida ao enviar o e-mail.'
    return {
      data: null,
      status: false,
      message: `[SMTP] ${msg}`,
    }
  }
}
