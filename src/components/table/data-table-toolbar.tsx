'use client'

import * as React from 'react'
import type { DataTableFilterField } from '@/components/table/types/table-types'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DataTableToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>
  filterFields?: DataTableFilterField<TData>[]
  actions?: React.ElementType[]
}

export function DataTableToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  actions,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    }
  }, [filterFields])

  return (
    <div className='flex items-center justify-between'>
      <div
        className={cn(
          'flex w-full items-center justify-between space-x-2 overflow-auto p-1',
          className,
        )}
        {...props}
      >
        <div className='flex flex-1 items-center space-x-2'>
          {searchableColumns.length > 0 &&
            searchableColumns.map(
              (column) =>
                table.getColumn(column.value ? String(column.value) : '') && (
                  <Input
                    key={String(column.value)}
                    placeholder={column.placeholder}
                    value={
                      (table
                        .getColumn(String(column.value))
                        ?.getFilterValue() as string) ?? ''
                    }
                    onChange={(event) =>
                      table
                        .getColumn(String(column.value))
                        ?.setFilterValue(event.target.value)
                    }
                    className='h-8 w-40 lg:w-64'
                  />
                ),
            )}
          {isFiltered && (
            <Button
              aria-label='Reset filters'
              variant='ghost'
              className='h-8 px-2 lg:px-3'
              onClick={() => table.resetColumnFilters()}
            >
              Resetar filtro(s)
              <Cross2Icon className='ml-2 size-4' aria-hidden='true' />
            </Button>
          )}
        </div>
      </div>

      <div className='flex-1' />

      {/* Actions */}
      <div className=' flex flex-row space-x-2'>
        {actions?.map((ActionJSX, index) => (
          <span key={ActionJSX.valueOf().toString() + index}>
            <ActionJSX />
          </span>
        ))}
      </div>
    </div>
  )
}
