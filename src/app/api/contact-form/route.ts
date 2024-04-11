import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.json()
  // console.log(data)
  const { email, cnpj, message, phone, name, allowNotifications } = data

  const res = await payload.create({
    collection: 'contact-messages',
    data: {
      acceptPrivacy: true,
      email: email,
      cnpj: cnpj,
      message: message,
      fone: phone,
      name: name,
      acceptEmail: allowNotifications,
    },
  })

  return Response.json(res)
}
