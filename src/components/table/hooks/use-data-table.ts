'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { z } from 'zod'

import { useDebounce } from '@/components/table/hooks/use-debounce'

interface UseDataTableProps<TData, TValue> {
  /**
   * The data for the table.
   * @default []
   * @type TData[]
   */
  data: TData[]

  /**
   * The columns of the table.
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[]

  /**
   * The number of pages in the table.
   * @type number
   */
  pageCount: number
}

const schema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional(),
})

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Search params
  const { page, per_page, sort } = schema.parse(
    Object.fromEntries(searchParams),
  )
  const [column, order] = sort?.split('.') ?? []

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams],
  )

  // Table states
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: per_page,
    })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
      })}`,
      {
        scroll: false,
      },
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize])

  // Handle server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? '',
      desc: order === 'desc',
    },
  ])

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page,
        sort: sorting[0]?.id
          ? `${sorting[0]?.id}.${sorting[0]?.desc ? 'desc' : 'asc'}`
          : null,
      })}`,
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  // Handle server-side filtering
  // const debouncedSearchableColumnFilters = JSON.parse(
  //   useDebounce(
  //     JSON.stringify(
  //       columnFilters.filter((filter) => {
  //         return searchableColumns.find((column) => column.id === filter.id)
  //       }),
  //     ),
  //     500,
  //   ),
  // ) as ColumnFiltersState

  // const filterableColumnFilters = columnFilters.filter((filter) => {
  //   return filterableColumns.find((column) => column.id === filter.id)
  // })

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(
    () => {
      // Prevent resetting the page on initial render
      if (!mounted) {
        setMounted(true)
        return
      }

      // Initialize new params
      const newParamsObject = {
        page: 1,
      }

      // Handle debounced searchable column filters
      // for (const column of debouncedSearchableColumnFilters) {
      //   if (typeof column.value === 'string') {
      //     Object.assign(newParamsObject, {
      //       [column.id]: typeof column.value === 'string' ? column.value : null,
      //     })
      //   }
      // }

      // Handle filterable column filters
      // for (const column of filterableColumnFilters) {
      //   if (typeof column.value === 'object' && Array.isArray(column.value)) {
      //     Object.assign(newParamsObject, { [column.id]: column.value.join('.') })
      //   }
      // }

      // Remove deleted values
      // for (const key of searchParams.keys()) {
      //   if (
      //     (searchableColumns.find((column) => column.id === key) &&
      //       !debouncedSearchableColumnFilters.find(
      //         (column) => column.id === key,
      //       )) ||
      //     (filterableColumns.find((column) => column.id === key) &&
      //       !filterableColumnFilters.find((column) => column.id === key))
      //   ) {
      //     Object.assign(newParamsObject, { [key]: null })
      //   }
      // }

      // After cumulating all the changes, push new params
      router.push(`${pathname}?${createQueryString(newParamsObject)}`)

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // JSON.stringify(debouncedSearchableColumnFilters),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      // JSON.stringify(filterableColumnFilters),
    ],
  )

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return { table }
}
