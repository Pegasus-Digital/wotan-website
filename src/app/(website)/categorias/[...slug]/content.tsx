import Link from 'next/link'
import { cn } from '@/lib/utils'

import { Product } from '@/payload/payload-types'

import { LowImpactHero } from '@/app/_sections/heros/lowImpact'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ProductCard } from '@/components/product-card'
import { Button, buttonVariants } from '@/components/ui/button'

import { Heading } from '@/pegasus/heading'

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
    <section className='w-full'>
      <div className='container flex flex-col items-center '>
        <LowImpactHero title={categoryName} />
        {products.length === 0 && (
          <div className='my-12 flex flex-col items-center justify-center space-y-4 rounded-lg text-center text-foreground'>
            <Heading variant='h3' className='text-foreground'>
              Não encontramos produtos nesta categoria.
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
        <div className='grid max-w-screen-desktop grid-flow-row grid-cols-2 gap-4 tablet:grid-cols-3 desktop:grid-cols-4'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
