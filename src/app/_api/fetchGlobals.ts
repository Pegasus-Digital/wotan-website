import type { Setting } from '../../payload/payload-types'
import { SETTINGS_QUERY } from '../_graphql/globals'
import { getServerURL } from '@/lib/server-url'

export async function fetchSettings(): Promise<Setting> {
  const settings = await fetch(
    `${getServerURL()}/api/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // cache: 'no-store',
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

