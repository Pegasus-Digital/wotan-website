import payload from 'payload'

import { SearchPageContent } from './content'

import { getSingular } from './../../../lib/singular'

export default async function CategoryPage({ params, searchParams }) {
  const page: number = searchParams ? Number(searchParams.page) : 1
  const query: string = searchParams ? String(searchParams.query) : ''

  const words = query.split(' ').filter((word) => word.length >= 3)

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

  console.log(whereQuery)

  const { docs, ...paginationParams } = await payload.find({
    collection: 'products',
    where: whereQuery,

    limit: 20,
    page: page,
  })

  return (
    <SearchPageContent
      products={docs}
      pagination={paginationParams}
      search={query}
    />
  )
}
