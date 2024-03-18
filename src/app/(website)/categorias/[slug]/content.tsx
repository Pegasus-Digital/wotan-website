import { cn } from '@/lib/utils'

import { Category, Product } from '@/payload/payload-types'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { Heading } from '@/pegasus/heading'
import { Button, buttonVariants } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import Link from 'next/link'

interface PaginationParams {
  totalDocs: number
  limit: number
  totalPages: number
  page?: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
}

interface CategoryPageProps {
  products: Product[]
  pagination: PaginationParams
  categoryName: string
}

export async function CategoryPageContent({
  products,
  pagination,
  categoryName,
}: CategoryPageProps) {
  const prevPage = pagination.hasPrevPage ? `?page=${pagination.prevPage}` : ''
  const nextPage = pagination.hasNextPage ? `?page=${pagination.nextPage}` : ''

  return (
    <section className='relative mt-6 w-full px-6 text-primary-foreground'>
      <div className='container flex flex-col items-center rounded-lg text-center text-foreground'>
        <Heading variant='h2' className='text-foreground'>
          Categoria: <span className='capitalize'>{categoryName}</span>
        </Heading>

        {products.length === 0 && (
          <div className='my-12 flex flex-col items-center justify-center space-y-4 rounded-lg text-center text-foreground'>
            <Heading variant='h2' className='text-foreground'>
              Não encontramos produtos para essa categoria.
            </Heading>

            <Link
              className={cn(buttonVariants(), 'text-lg font-medium')}
              href='/'
            >
              Voltar para o início.
            </Link>
          </div>
        )}
        {/* Products grid */}
        <div className='grid grid-flow-row grid-cols-5 gap-4'>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              minimumQuantity={product.minimumQuantity}
              categories={product.categories.map(
                (category: Category) => category.title,
              )}
            />
          ))}
        </div>
        {products.length > 0 && (
          <Pagination className='sticky w-full py-6'>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={cn(
                    prevPage === ''
                      ? 'pointer-events-none text-muted-foreground'
                      : null,
                  )}
                  href={prevPage}
                />
              </PaginationItem>

              {pagination.hasPrevPage ? (
                <PaginationItem>
                  <PaginationLink href={prevPage}>
                    {pagination.prevPage}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <Button variant='ghost' size='icon' disabled>
                  -
                </Button>
              )}

              <PaginationItem>
                <PaginationLink
                  className='bg-wotanRed-500 text-primary-foreground hover:bg-wotanRed-300 hover:text-primary-foreground'
                  href='?page=1'
                >
                  {pagination.page}
                </PaginationLink>
              </PaginationItem>

              {pagination.hasNextPage ? (
                <PaginationItem>
                  <PaginationLink href={nextPage}>
                    {pagination.nextPage}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <Button variant='ghost' size='icon' disabled>
                  -
                </Button>
              )}

              <PaginationItem>
                <PaginationNext
                  className={cn(
                    nextPage === ''
                      ? 'pointer-events-none text-muted-foreground'
                      : null,
                  )}
                  href={nextPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  )
}
