import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function GET(request: NextRequest, response: NextResponse) {
  try {
    const response = await payload.find({
      collection: 'attributes',
      limit: 1000,
      depth: 5,
      pagination: false,
    })

    return Response.json(response)
  } catch (error) {
    console.error(error)
    return Response.json(error)
  }
}
