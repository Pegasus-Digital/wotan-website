import { Table } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'

interface DataTableInputFilterProps<TData> {
  columnId: string
  table: Table<TData>
  title: string
  plural?: boolean
}

export function DataTableInputFilter<TData>({
  columnId,
  table,
  title,
  plural = false,
}: DataTableInputFilterProps<TData>) {
  return (
    <Input
      placeholder={`Filtrar por ${title}${plural ? 's' : ''}...`}
      value={(table.getColumn(columnId)?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn(columnId)?.setFilterValue(event.target.value)
      }
      className='max-w-sm'
    />
  )
}
