import { getPayloadClient } from '@/lib/get-payload'
import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'

export async function POST(request: NextRequest, response: NextResponse) {
  // noStore()
  console.log(await request.json())

  try {
    const data = await request.json()

    console.log(data)
    const payload = await getPayloadClient()

    // return fetch('http://localhost:3000/api/media', {
    //   method: 'POST',
    //   body: formData,
    // })

    return Response.json('Test')
  } catch (error) {
    console.error(error)
    return Response.json(error)
  }
}
