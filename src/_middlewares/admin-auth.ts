import type { NextRequest } from 'next/server'

// Server-side JWT auth cookie validation
export async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value

  if (!token) {
    return false
  }

  const meUserReq = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  )

  if (meUserReq.ok) {
    return true
  }
}
