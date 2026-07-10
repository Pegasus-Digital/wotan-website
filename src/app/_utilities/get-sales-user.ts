import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { Salesperson } from '../../payload/payload-types'

export const getSalesUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  user: Salesperson
  token: string
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}
  const token = cookies().get('payload-token')?.value

  // console.log('token', token)

  if (!token) {
    return {
      user: null,
      token: null,
    }
  }

  const meUserReq = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/salespersons/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    },
  )

  // console.log('meUserReq', meUserReq)

  const {
    user,
  }: {
    user: Salesperson
  } = await meUserReq.json()

  if (validUserRedirect && meUserReq.ok && user) {
    redirect(validUserRedirect)
  }

  if (nullUserRedirect && (!meUserReq.ok || !user)) {
    redirect(nullUserRedirect)
  }

  return {
    user,
    token,
  }
}
