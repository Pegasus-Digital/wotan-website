import { getPayloadClient } from '@/lib/get-payload'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const payload = await getPayloadClient()

    const response = await payload.find({
      collection: 'attributes',
      pagination: false,
      depth: 5,
    })

    return Response.json(response.docs)
  } catch (error) {
    console.error(error)
    return Response.json(error)
  }
}
