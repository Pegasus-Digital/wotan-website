import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.json()

  const products = await payload.find({
    collection: 'products',
    where: {
      sku: {
        equals: data.sku,
      },
    },
    limit: 3,
  })

  return Response.json(products)
}
