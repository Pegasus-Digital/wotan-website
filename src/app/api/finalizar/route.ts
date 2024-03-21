import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

interface CartData {
  id?: string
  productId?: string
  productName?: string
  amount?: number
  attributes?: any[]
}

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.json()

  const cart: CartData[] = data.items
  const contact = data.contact

  try {
    const response = await payload.create({
      collection: 'budget',
      data: {
        items: cart.map((item) => {
          return {
            product: item.productId,
            quantity: item.amount,
            attributes: item.attributes
              ? item.attributes.map((attribute) => attribute.id)
              : [],
          }
        }),
        contact,
      },
    })

    return Response.json(response)
  } catch (error) {
    console.error(error)
  }
}
