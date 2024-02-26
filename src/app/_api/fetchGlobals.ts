import type { Setting } from '../../payload/payload-types'
import { COMPANY_QUERY, SETTINGS_QUERY } from '../_graphql/globals'

export async function fetchSettings(): Promise<Setting> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL)
    throw new Error('NEXT_PUBLIC_SERVER_URL not found')

  const settings = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        query: SETTINGS_QUERY,
      }),
    },
  )
    ?.then((res) => {
      if (!res.ok) throw new Error('Error fetching doc')
      return res.json()
    })
    ?.then((res) => {
      if (res?.errors)
        throw new Error(res?.errors[0]?.message || 'Error fetching settings')
      return res.data?.Setting
    })

  return settings
}

export async function fetchCompany() {
  if (!process.env.NEXT_PUBLIC_SERVER_URL)
    throw new Error('NEXT_PUBLIC_SERVER_URL not found')

  const company = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify({
        query: COMPANY_QUERY,
      }),
    },
  )
    ?.then((res) => {
      if (!res.ok) throw new Error('Error fetching doc')
      return res.json()
    })
    ?.then((res) => {
      if (res?.errors)
        throw new Error(res?.errors[0]?.message || 'Error fetching settings')
      return res.data?.Company
    })

  return company
}
