'use client'

import { useState } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { sendSmtpTestEmail, verifySmtpTransport } from './_logic/actions'
import {
  AlertCircle,
  Cable,
  CheckCircle2,
  Loader2,
  Mail,
  Send,
  Server,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
})

export type SmtpEnvSummary = {
  ready: boolean
  host?: string
  port?: string
  fromAddress?: string
  authUserSet: boolean
  authPassSet: boolean
}

interface EmailTestContentProps {
  smtp: SmtpEnvSummary
}

function ConfigRow({
  label,
  value,
  mono,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className='flex flex-col gap-0.5 border-b border-border/60 py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4'>
      <span className='shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground'>
        {label}
      </span>
      <span
        className={cn(
          'min-w-0 text-right text-sm font-medium text-foreground',
          mono && 'font-mono text-[13px]',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function EmailTestContent({ smtp }: EmailTestContentProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [confirmSendOpen, setConfirmSendOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const openSendConfirm = form.handleSubmit(() => {
    setConfirmSendOpen(true)
  })

  const confirmSend = form.handleSubmit(async (values) => {
    setIsSending(true)
    try {
      const response = await sendSmtpTestEmail(values.email)
      if (response.status) {
        toast.success(response.message)
        setConfirmSendOpen(false)
      } else {
        toast.error(response.message)
      }
    } finally {
      setIsSending(false)
    }
  })

  async function onVerifyConnection() {
    setIsVerifying(true)
    try {
      const response = await verifySmtpTransport()
      if (response.status) {
        toast.success(response.message)
      } else {
        toast.error(response.message)
      }
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <ContentLayout title='E-mail (SMTP)'>
      <div className='mx-auto max-w-5xl space-y-8'>
        <div
          className={cn(
            'flex flex-col gap-4 rounded-2xl border p-5 shadow-sm transition-colors sm:flex-row sm:items-center sm:justify-between',
            smtp.ready
              ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white'
              : 'border-amber-200/90 bg-gradient-to-br from-amber-50/90 to-white',
          )}
        >
          <div className='flex min-w-0 items-start gap-4'>
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm',
                smtp.ready
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-500 text-white',
              )}
            >
              {smtp.ready ? (
                <CheckCircle2 className='h-6 w-6' strokeWidth={2} />
              ) : (
                <AlertCircle className='h-6 w-6' strokeWidth={2} />
              )}
            </div>
            <div className='min-w-0 space-y-1'>
              <p className='text-lg font-semibold tracking-tight text-zinc-900'>
                {smtp.ready
                  ? 'Variáveis SMTP presentes'
                  : 'Configuração incompleta'}
              </p>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                {smtp.ready
                  ? 'Você pode verificar a conexão ou enviar um e-mail de teste. Variáveis preenchidas não garantem entrega — só o envio confirma caixa de entrada e spam.'
                  : 'Defina SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_USER e SMTP_PASS no ambiente do servidor para habilitar as ações abaixo.'}
              </p>
            </div>
          </div>
          <Badge
            variant={smtp.ready ? 'affirmative' : 'destructive'}
            className='shrink-0 self-start sm:self-center'
          >
            {smtp.ready ? 'Pronto para testar' : 'Ação necessária'}
          </Badge>
        </div>

        <div className='grid gap-6 lg:grid-cols-2 lg:items-start'>
          <Card className='overflow-hidden border-zinc-200/90 shadow-sm'>
            <CardHeader className='space-y-1 border-b border-border/60 bg-zinc-50/80 pb-4'>
              <div className='flex items-center gap-2'>
                <Server className='h-5 w-5 text-wotanRed-500' aria-hidden />
                <CardTitle className='text-lg'>Ambiente</CardTitle>
              </div>
              <CardDescription className='text-pretty'>
                Leitura das variáveis no servidor. Credenciais não são exibidas.
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-0'>
              <ConfigRow label='Host' value={smtp.host ?? '—'} mono />
              <ConfigRow label='Porta' value={smtp.port ?? '—'} mono />
              <ConfigRow label='Remetente (from)' value={smtp.fromAddress ?? '—'} />
              <ConfigRow
                label='Usuário SMTP'
                value={smtp.authUserSet ? 'Definido' : 'Não definido'}
              />
              <ConfigRow
                label='Senha SMTP'
                value={smtp.authPassSet ? 'Definida' : 'Não definida'}
              />
            </CardContent>
          </Card>

          <Card className='overflow-hidden border-zinc-200/90 shadow-sm'>
            <CardHeader className='space-y-1 border-b border-border/60 bg-zinc-50/80 pb-4'>
              <div className='flex items-center gap-2'>
                <Mail className='h-5 w-5 text-wotanRed-500' aria-hidden />
                <CardTitle className='text-lg'>Testes</CardTitle>
              </div>
              <CardDescription className='text-pretty'>
                Primeiro valide conexão e autenticação; depois, se quiser, envie
                uma mensagem real.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6 pt-6'>
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-wotanRed-600'>
                    1
                  </span>
                  Verificação de conexão
                </div>
                <p className='pl-9 text-sm leading-relaxed text-muted-foreground'>
                  Conecta ao servidor SMTP, negocia TLS e valida usuário e senha — equivalente ao que o
                  sistema executa na inicialização.
                </p>
                <div className='pl-9'>
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full sm:w-auto'
                    disabled={!smtp.ready || isVerifying}
                    onClick={onVerifyConnection}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Verificando
                      </>
                    ) : (
                      <>
                        <Cable className='mr-2 h-4 w-4' />
                        Verificar SMTP
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <div className='space-y-4'>
                <div className='flex items-center gap-2 text-sm font-medium text-foreground'>
                  <span className='flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-wotanRed-600'>
                    2
                  </span>
                  Envio de teste
                </div>
                <Form {...form}>
                  <form
                    className='space-y-4 pl-0 sm:pl-9'
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destinatário</FormLabel>
                          <FormControl>
                            <Input
                              type='email'
                              placeholder='voce@exemplo.com'
                              autoComplete='email'
                              disabled={!smtp.ready}
                              className='max-w-md'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='button'
                      className='w-full sm:w-auto'
                      disabled={!smtp.ready}
                      onClick={openSendConfirm}
                    >
                      <Send className='mr-2 h-4 w-4' />
                      Enviar teste
                    </Button>
                  </form>
                </Form>

                <Dialog open={confirmSendOpen} onOpenChange={setConfirmSendOpen}>
                  <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                      <DialogTitle>Confirmar envio</DialogTitle>
                      <DialogDescription>
                        Será enviado um e-mail de teste pelo SMTP da plataforma para:
                      </DialogDescription>
                    </DialogHeader>
                    <p className='rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm'>
                      {form.watch('email') || '—'}
                    </p>
                    <DialogFooter className='gap-2 sm:gap-0'>
                      <Button
                        type='button'
                        variant='outline'
                        disabled={isSending}
                        onClick={() => setConfirmSendOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type='button' disabled={isSending} onClick={confirmSend}>
                        {isSending ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Enviando
                          </>
                        ) : (
                          <>
                            <Send className='mr-2 h-4 w-4' />
                            Confirmar envio
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  )
}
