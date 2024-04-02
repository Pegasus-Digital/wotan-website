import { NestedCategory } from '@/lib/category-hierarchy'

import { Button } from '@/pegasus/button'
import { Label } from '@/components/ui/label'

import { Pencil, Trash } from 'lucide-react'

interface CategorySpanProps {
  category: NestedCategory
  handleRemoveCategory: (category: NestedCategory) => void
  setOpen: (state: boolean) => void
  setSelected: (category: NestedCategory) => void
}

export function CategorySpan({
  category,
  setOpen,
  setSelected,
  handleRemoveCategory,
}: CategorySpanProps) {
  return (
    <div className='w-full space-y-0.5 pl-4'>
      <div className='flex items-center space-x-2 '>
        <Button
          onClick={() => setSelected(category)}
          variant='outline'
          size='icon'
          className='h-6 w-6'
        >
          <Pencil className='h-4 w-4' />
        </Button>

        <Button
          onClick={() => handleRemoveCategory(category)}
          variant='outline'
          size='icon'
          className='h-6 w-6'
        >
          <Trash className='h-4 w-4' />
        </Button>
        <Label>{category.title}</Label>
      </div>

      {category.children.map((item) => (
        <CategorySpan
          key={item.id}
          setOpen={setOpen}
          setSelected={setSelected}
          category={item}
          handleRemoveCategory={handleRemoveCategory}
        />
      ))}
    </div>
  )
}
