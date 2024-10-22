import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'
import { unstable_noStore as noStore } from 'next/cache'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  noStore()

  try {
    // Retrieve the token from the request headers
    const cookie = request.cookies.get('payload-token')
    if (!cookie) throw new Error('Token não encontrado')
    // Decode the token to get the user ID
    const decodedToken = await jwt.decode(cookie.value)

    const userId = decodedToken?.id // Adjust this based on your token structure
    if (!userId) throw new Error('ID de usuário não encontrado no token')

    // Check existence in users collection
    const user = await payload.find({
      collection: 'users',
      where: {
        id: {
          equals: userId,
        },
      },
      limit: 1,
    })

    if (user.docs.length > 0) {
      return NextResponse.json({ user: user.docs[0], type: 'user' })
    }

    // If not found in users, check existence in salespersons collection
    const salesperson = await payload.find({
      collection: 'salespersons',
      where: {
        id: {
          equals: userId,
        },
      },
      limit: 1,
    })

    if (salesperson.docs.length > 0) {
      return NextResponse.json({
        user: salesperson.docs[0],
        type: 'salesperson',
      })
    }

    // If not found in either, return an unauthorized response
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 },
    )
  } catch (error) {
    console.error('Error verifying user:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
