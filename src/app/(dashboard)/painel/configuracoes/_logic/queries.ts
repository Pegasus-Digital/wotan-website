import 'server-only'

import payload from 'payload'
import { unstable_noStore as noStore } from 'next/cache'

export async function getSettingsGlobal() {
  noStore()

  try {
    const response = await payload.findGlobal({
      slug: 'settings',
    })

    return {
      data: response,
    }
  } catch (err) {
    return { data: null }
  }
}
