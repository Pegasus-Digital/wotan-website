import payload from 'payload'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryPageContent } from './content'

export default async function CategoryPage({ params, searchParams }) {
  const categorySlug: string = params.slug.at(-1)
  const page: number = searchParams?.page ? Number(searchParams.page) : 1

  // Buscar a categoria primeiro
  const categoryRes = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug }, active: { not_equals: false } },
    limit: 1,
  })

  if (categoryRes.docs.length === 0) {
    notFound()
  }

  const categoryTitle = categoryRes.docs[0].title

  // Buscar os produtos
  const productsRes = await payload.find({
    collection: 'products',
    where: { 'categories.breadcrumbs.label': { contains: categoryTitle } },
    limit: 20,
    page,
  })

  return (
    <CategoryPageContent
      products={productsRes.docs}
      pagination={productsRes}
      categoryName={categoryTitle}
    />
  )
}

export async function generateMetadata({ params }): Promise<Metadata> {
  const categorySlug: string = params.slug.at(-1)

  const res = await payload.find({
    collection: 'categories',
    where: { slug: { equals: categorySlug }, active: { not_equals: false } },
    limit: 1,
  })

  return { title: res.docs.length > 0 ? res.docs[0].title : 'Categoria' }
}
