import { AfterChangeHook } from 'payload/dist/collections/config/types'

export const onBudgetFromWebsite: AfterChangeHook = async ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation === 'create' && doc.origin !== 'website') {
    console.log('Fui criado do dashboard')
  }

  if (operation === 'create' && doc.origin === 'website') {
    // send email to the admin
    await payload.sendEmail({
      from: 'wotan@test.com',
      to: 'admin@wotan.com',
      subject: 'Test email',
      html: '<p>HTML based message</p>',
    })
  }
}
