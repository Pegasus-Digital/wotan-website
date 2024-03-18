import payload from 'payload'

import { CategoryPageContent } from './content'

export default async function CategoryPage({ params, searchParams }) {
  const category: string = params.slug[params.slug.length - 1]
  const page: number = searchParams ? Number(searchParams.page) : 1

  const res = await payload.find({
    collection: 'categories',
    where: {
      title: {
        contains: category,
      },
    },
    limit: 1,
    pagination: false,
  })
  console.log(res)
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
      categoryName={res.docs[0].title}
    />
  )
}
