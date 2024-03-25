import payload from 'payload'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CategoryPageContent } from './content'

export default async function CategoryPage({ params, searchParams }) {
  const category: string = params.slug[params.slug.length - 1]
  const page: number = searchParams ? Number(searchParams.page) : 1

  const res = await payload.find({
    collection: 'categories',
    where: {
      slug: {
        equals: category,
      },
    },
    limit: 1,
    pagination: false,
  })

  if (res.docs.length < 1) {
    notFound()
  }

  const { docs, ...paginationParams } = await payload.find({
    collection: 'products',
    where: {
      'categories.breadcrumbs.label': {
        contains: res.docs[0].title,
      },
    },
    limit: 20,
    page: page,
  })

  if (paginationParams.totalDocs <= 0) {
    return notFound()
  }

  return (
    <CategoryPageContent
      products={docs}
      pagination={paginationParams}
      categoryName={res.docs[0].title}
    />
  )
}

export async function generateMetadata({
  params,
  searchParams,
}): Promise<Metadata> {
  return { title: `Buscando por '${params.slug[params.slug.length - 1]}'` }
}
