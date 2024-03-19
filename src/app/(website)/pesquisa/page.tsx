import payload from 'payload'

import { SearchPageContent } from './content'

export default async function CategoryPage({ params, searchParams }) {
  const page: number = searchParams ? Number(searchParams.page) : 1
  const query: string = searchParams ? String(searchParams.query) : ''

  const { docs, ...paginationParams } = await payload.find({
    collection: 'products',
    where: {
      or: [
        {
          title: {
            contains: query,
          },
        },
        {
          sku: {
            contains: query,
          },
        },
      ],
    },
    limit: 20,
    page: page,
  })

  return (
    //@ts-ignore
    <SearchPageContent
      products={docs}
      pagination={paginationParams}
      search={query}
    />
  )
}
