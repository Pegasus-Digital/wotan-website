import { AfterChangeHook } from 'payload/dist/collections/config/types'

// Send email to the platform admin if a budget is created through the website
export const onBudgetFromWebsite: AfterChangeHook = async ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation === 'create' && doc.origin === 'website') {
    const subject = `Orçamento #${doc.incrementalId ?? 'recebido'} | Plataforma Wotan`

    await payload.sendEmail({
      from: process.env.PLATFORM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject,
      html: `<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="background-color: #CC0F4B; padding: 20px; text-align: center; color: #ffffff;">
          <img src="${process.env.NEXT_PUBLIC_SERVER_URL}/media/logo2017.png" alt="Wotan Brindes Logo" style="width: 320px; height: auto; margin-bottom: 10px;" />
          <p style="margin: 5px 0; font-size: 16px;">Soluções personalizadas para a sua marca</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px; color: #333333; font-size: 16px; line-height: 1.6;">
          <p>Olá, equipe Wotan,</p>
          <p>
            Um novo orçamento foi solicitado através do site. Abaixo estão as principais informações enviadas pelo cliente:
          </p>

          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 20px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Nº do orçamento:</strong> ${doc.incrementalId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Data:</strong> ${new Date(doc.createdAt).toLocaleDateString('pt-BR')}</td>
            </tr>
          </table>

          <h3 style="margin: 20px 0 10px;">Dados do cliente</h3>
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0;"><strong>Empresa:</strong> ${doc.contact?.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Nome:</strong> ${doc.contact?.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Email:</strong> <a href="mailto:${doc.contact?.email}" style="color: #CC0F4B; text-decoration: none;">${doc.contact?.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0;"><strong>Telefone:</strong> ${doc.contact?.phone}</td>
            </tr>
          </table>

          <h3 style="margin: 20px 0 10px;">Itens do orçamento</h3>
          <table width="100%" border="0" cellpadding="5" cellspacing="0" style="border-collapse: collapse; border: 1px solid #ddd; font-size: 15px;">
            <tr style="background-color: #f4f4f4;">
              <th align="left" style="padding: 8px;">Produto</th>
              <th align="left" style="padding: 8px;">Código</th>
              <th align="center" style="padding: 8px;">Quantidade</th>
            </tr>
            ${doc.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px; border-top: 1px solid #eee;">${item.product?.title || 'Produto sem nome'}</td>
                <td align="center" style="padding: 8px; border-top: 1px solid #eee;">${item.product?.sku || ''}</td>
                <td align="center" style="padding: 8px; border-top: 1px solid #eee;">${item.quantity}</td>
              </tr>
            `,
              )
              .join('')}
          </table>

          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/sistema/orcamentos/${doc.incrementalId}" target="_blank" style="display: inline-block; background-color: #CC0F4B; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Visualizar Orçamento
            </a>
          </p>

          <p>
            Este orçamento foi enviado automaticamente a partir do site da Wotan Brindes. Em caso de dúvidas, verifique as informações ou entre em contato com o cliente.
          </p>
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
  </body>`,
    })
  }
}
