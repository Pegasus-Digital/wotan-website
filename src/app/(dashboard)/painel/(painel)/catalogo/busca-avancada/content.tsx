'use client'
import { cn } from '@/lib/utils'

import { Product } from '@/payload/payload-types'

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
import Image from 'next/image'

import { Heading } from '@/pegasus/heading'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@radix-ui/react-select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  search: string
}

export async function SearchPageContent({
  products,
  pagination,
  search,
}: CategoryPageProps) {
  const prevPage = pagination.hasPrevPage
    ? `?query=${search}&page=${pagination.nextPage}`
    : ''

  const nextPage = pagination.hasNextPage
    ? `?query=${search}&page=${pagination.nextPage}`
    : ''

  const searchParams = useSearchParams()
  console.log('search', search)
  const router = useRouter()

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const query = e.currentTarget.search.value

    if (query.length >= 3) {
      router.push(
        `/painel/catalogo/busca-avancada?query=${encodeURIComponent(query)}`,
      )
    } else {
      toast.warning('A pesquisa deve conter no mínimo 3 caracteres.', {
        icon: <Icons.SearchFail className='h-5 w-5' />,
      })
    }
  }

  const [isCopied, setIsCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCopy = async (sku: string) => {
    try {
      await navigator.clipboard.writeText(sku)
      setIsCopied(true)
      setShowTooltip(true)
    } catch (error) {
      console.error('Failed to copy: ', error)
    }
  }
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
        setShowTooltip(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isCopied])
  return (
    <ContentLayout title={`Busca Avançada`}>
      <div className='flex min-h-[calc(100vh-56px-32px-32px-64px)] w-full flex-col items-center justify-between'>
        <form
          onSubmit={handleSearch}
          className='flex  w-full rounded-md bg-background focus:ring-1 tablet:mx-6'
        >
          <label htmlFor='search' className='sr-only'>
            Search
          </label>
          <Input
            id='search'
            name='search'
            placeholder='Estou procurando por...'
            // minLength={3}
            maxLength={64}
            type='text'
            className='h-auto w-auto grow border-0 focus-visible:ring-0'
            defaultValue={searchParams.get('query')?.toString()}
          />
          <Button
            type='submit'
            size='icon'
            className='bg-background text-primary hover:bg-background'
          >
            <Icons.Search className='h-6 w-6' />
          </Button>
        </form>
        {search !== ('' || undefined) && products.length === 0 && (
          <div className='my-12 flex flex-col items-center justify-center space-y-4 rounded-lg text-center text-foreground'>
            <Heading variant='h4' className='text-foreground'>
              Não encontramos produtos para essa pesquisa.
            </Heading>
          </div>
        )}
        {/* Products grid */}
        <div className='mt-4 w-full grow'>
          {products.length > 0 && (
            <Table>
              <TableHeader className='w-full'>
                <TableRow className='w-full'>
                  <TableHead className='w-36 pl-2 pr-0'></TableHead>
                  <TableHead className='w-72 pl-2 pr-0'>Título</TableHead>
                  <TableHead className='w-32 pl-2 pr-0'>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className='pl-2 pr-0'>
                      <Image
                        src={
                          typeof product.featuredImage === 'object'
                            ? product.featuredImage.url
                            : ''
                        }
                        alt={product.title}
                        className='h-32 w-32 rounded-md object-cover'
                        width={96}
                        height={96}
                      />
                    </TableCell>
                    <TableCell className=' pl-2 pr-0'>
                      {product.title}
                    </TableCell>
                    <TableCell className=' pl-2 pr-0'>
                      <div className='flex h-full flex-row items-center justify-center gap-2'>
                        {product.sku}

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size='icon'
                                onClick={() => handleCopy(product.sku)}
                                variant='ghost'
                              >
                                <Icons.Copy className='h-5 w-5' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side='top' align='center'>
                              {isCopied ? 'Copiado!' : 'Copiar SKU'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell className=''>
                      <Textarea
                        maxLength={300}
                        className='min-h-24 disabled:opacity-100'
                        disabled
                      >
                        {product.description}
                      </Textarea>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <Pagination className='sticky w-full py-4'>
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
      </div>
    </ContentLayout>
  )
}
