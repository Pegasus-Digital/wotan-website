import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.json()

  const product = await payload.findByID({
    collection: 'products',
    id: data.productId,
    depth: 2,
  })

  return Response.json(product)
}
