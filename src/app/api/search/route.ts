import { getSingular } from '@/lib/singular'
import { NextRequest, NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.json()

  const words = data.query.split(' ').filter((word) => word.length >= 3)

  function createObjectsForWords(words) {
    const objects = []

    words.forEach((word, index) => {
      if (index > 0) {
        objects.push({
          or: [
            {
              title: {
                contains: getSingular(word),
              },
            },
            {
              description: {
                contains: getSingular(word),
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
    return searchFields.map((field) => ({
      [field]: {
        contains: getSingular(word),
      },
    }))
  }

  const whereQuery = {
    or: [
      // Conditions for the first word
      ...generateWordConditions(words[0]),
    ],
    and: createObjectsForWords(words),
  }

  const products = await payload.find({
    collection: 'products',
    where: whereQuery,
    limit: 20,
  })

  return Response.json(products)
}
