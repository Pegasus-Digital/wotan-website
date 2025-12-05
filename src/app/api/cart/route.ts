import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const data = await request.json()

    // # ATTENTION: If two or more products in the cart have the same ID
    //  a single product will be returned by this, so the data needs to reused
    const products = await payload.find({
      collection: 'products',
      where: {
        id: { in: data.productIds.join(',') },
      },
      depth: 2,
    })

    return Response.json(products)
  } catch (error) {
    console.error('Error in cart route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
