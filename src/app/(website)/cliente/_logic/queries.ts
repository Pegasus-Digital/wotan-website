import 'server-only'

import payload from 'payload'

import { unstable_noStore as noStore } from 'next/cache'
import { Budget } from '@/payload/payload-types'

interface GetBudgetByIdProps {
  id: string
}

interface GetBudgetByIdResponse {
  data: Budget | null
}

export async function getBudgetById({
  id,
}: GetBudgetByIdProps): Promise<GetBudgetByIdResponse> {
  noStore()

  try {
    const budget = await payload.findByID({
      id,
      collection: 'budget',
    })
    console.log('Achei')
    return { data: budget }
  } catch (err) {
    console.log('Error')
    return { data: null }
  }
}
