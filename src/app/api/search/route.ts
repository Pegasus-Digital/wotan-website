import { getSingular } from '@/lib/singular'
import { toAccentInsensitivePattern } from '@/lib/accent-insensitive'
import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const data = await request.json()

    const words = data.query.split(' ').filter((word) => word.length >= 3)

  function createObjectsForWords(words) {
    const objects = []

    words.forEach((word, index) => {
      if (index > 0) {
        const pattern = toAccentInsensitivePattern(getSingular(word))
        objects.push({
          or: [
            {
              title: {
                contains: pattern,
              },
            },
            {
              description: {
                contains: pattern,
              },
            },
          ],
        })
      }
    })

    return objects
  }

  const searchFields = [
    'title',
    'sku',
    'categories.breadcrumbs.label',
    'description',
  ]

  // Define a function to generate conditions for a single word
  const generateWordConditions = (word) => {
    const pattern = toAccentInsensitivePattern(getSingular(word))
    return searchFields.map((field) => ({
      [field]: {
        contains: pattern,
      },
    }))
  }

  const notDraft = { _status:{ equals:'published'}} 

  const whereQuery = {
    or: [
      // Conditions for the first word
      ...generateWordConditions(words[0]),
    ],
    and: [...createObjectsForWords(words), notDraft ],
  }

  // console.log(whereQuery)

  const products = await payload.find({
    collection: 'products',
    where: whereQuery,
    limit: 20,
  })

  console.log(products)

  // if (products?.docs) {
  //   products.docs.reverse()
  // }
    return Response.json(products)
  } catch (error) {
    console.error('Error in search route:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
