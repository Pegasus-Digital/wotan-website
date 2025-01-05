import { AfterChangeHook } from 'payload/dist/collections/config/types'

// Send email to the platform admin if a budget is created through the website
export const onBudgetFromWebsite: AfterChangeHook = async ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation === 'create' && doc.origin === 'website') {
    await payload.sendEmail({
      from: process.env.PLATFORM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Novo orçamento | Plataforma Wotan',
      html: '<p>Novo orçamento chegou pelo site.</p>',
    })
  }
}
