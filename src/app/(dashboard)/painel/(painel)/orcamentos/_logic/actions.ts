'use server'

import { revalidatePath } from 'next/cache'

import { ActionResponse } from '@/lib/actions'

import payload from 'payload'
import { Budget, Salesperson } from '@/payload/payload-types'

interface EmailBudgetToCustomerProps {
  budget: Budget
  emailAddress: string
}

interface EmailBudgetToCustomerResponseData {}

export async function emailBudgetToCustomer({
  budget,
  emailAddress,
}: EmailBudgetToCustomerProps): Promise<
  ActionResponse<EmailBudgetToCustomerResponseData>
> {
  const salespersonEmail = (budget.salesperson as Salesperson).email
  const salespersonName = (budget.salesperson as Salesperson).name

  try {
    // Send budget to customer via email
    await payload.sendEmail({
      // sender: `${process.env.SMTP_EMAIL}`,
      from: `${salespersonName} <${salespersonEmail}>`,
      replyTo: `${salespersonName} <${salespersonEmail}>`,
      to: emailAddress,
      subject: 'Orçamento - Wotan Brindes',
      html: `
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
            <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <tr>
                <td style="background-color: #CC0F4B; padding: 20px; text-align: center; color: #ffffff;">
                  <img src="${process.env.NEXT_PUBLIC_SERVER_URL}/media/logo2017.png" alt="Wotan Brindes Logo" style="width: 320px; height: auto; margin-bottom: 10px;" />
                  <p style="margin: 5px 0; font-size: 16px;">Soluções personalizadas para a sua marca</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                  <p>Olá,</p>
                  <p>
                    Temos novidades sobre o seu orçamento! Para visualizar os detalhes e acompanhar as informações, clique no botão abaixo:
                  </p>
                  <p style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/orcamento/${budget.id}" target="_blank" style="display: inline-block; background-color: #CC0F4B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                      Ver Detalhes do Orçamento
                    </a>
                  </p>
                  <p>
                    Caso precise de mais informações ou tenha alguma dúvida, nossa equipe está à disposição para ajudar. Não hesite em entrar em contato conosco.
                  </p>
                  <p>Atenciosamente,</p>
                  <p><strong>Equipe Wotan Brindes</strong></p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #888888;">
                  <p>Este é um email automático enviado por Wotan Brindes. Por favor, não responda diretamente a este email.</p>
                  <p>© 2025 Wotan Brindes - Todos os direitos reservados.</p>
                  <p><a href="https://wotanbrindes.com.br" style="color: #004080; text-decoration: none;">Visite nosso site</a></p>
                </td>
              </tr>
            </table>
          </body>
      `,
    })

    // console.log('Email sent.')

    await payload.update({
      collection: 'budget',
      id: budget.id,
      data: {
        status: 'enviado',
      },
    })

    revalidatePath('/painel/orcamentos')
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao enviar o email.',
    }
  }
}

interface DeleteBudgetProps {
  budgetId: string
}

interface DeleteBudgetResponseData {}

export async function deleteBudget({
  budgetId,
}: DeleteBudgetProps): Promise<ActionResponse<DeleteBudgetResponseData>> {
  try {
    const response = await payload.delete({
      collection: 'budget',
      where: { id: { equals: budgetId } },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao deletar o orçamento.',
      }
    }

    revalidatePath('/painel/contato')

    return {
      data: null,
      status: true,
      message: 'Orçamento deletado com sucesso.',
    }
  } catch (err) {
    // console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao deletar o orçamento.',
    }
  }
}

type SafeBudget = Omit<Budget, 'createdAt' | 'updatedAt' | 'id'>

interface CreateBudgetResponseData {
  budget: Budget | null
}
export async function createBudget(
  budget: SafeBudget,
): Promise<ActionResponse<CreateBudgetResponseData>> {
  try {
    const response = await payload.create({
      collection: 'budget',
      data: { ...budget },
    })

    revalidatePath('/painel/orcamentos')

    // console.log(response)

    return {
      data: { budget: response },
      status: true,
      message: 'Orçamento criado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao criar orçamento.',
    }
  }
}

interface UpdateBudgetProps {
  budget: SafeBudget
  id: Budget['id']
}

interface UpdateActionResponseData {
  budget: Budget | null
}

export async function UpdateBudget({
  budget,
  id,
}: UpdateBudgetProps): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'budget',
      where: { id: { equals: id } },
      data: { ...budget },
    })

    revalidatePath('/painel/orcamentos')

    return {
      data: { budget: response.docs[0] },
      status: true,
      message: 'Orçamento atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o orçamento.',
    }
  }
}

interface UpdateBudgetStatusProps {
  id: string
  status: Budget['status']
}

export async function updateBudgetStatus({
  id,
  status,
}: UpdateBudgetStatusProps): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'budget',
      where: { id: { equals: id } },
      data: { status },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o vendedor.',
      }
    }

    revalidatePath('/painel/orcamentos')

    return {
      data: { budget: response.docs[0] },
      status: true,
      message: 'Vendedor atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o vendedor.',
    }
  }
}
