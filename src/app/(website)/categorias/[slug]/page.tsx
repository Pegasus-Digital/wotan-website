import payload from 'payload'

import { CategoryPageContent } from './content'

export default async function CategoryPage({ params, searchParams }) {
  const category: string = params.slug
  const page: number = searchParams ? Number(searchParams.page) : 1

  const { docs, ...paginationParams } = await payload.find({
    collection: 'products',
    where: {
      'categories.title': {
        contains: category,
      },
    },
    limit: 15,
    page: page,
  })

  return (
    <CategoryPageContent
      products={docs}
      pagination={paginationParams}
      categoryName={category}
    />
  )
}