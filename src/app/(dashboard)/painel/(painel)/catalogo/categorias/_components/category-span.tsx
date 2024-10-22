import { NestedCategory } from '@/lib/category-hierarchy'

import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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
    <div
      className={`w-full space-y-0.5 pl-4  ${category.children.length > 0 ? '' : ''}`}
    >
      <div
        className={` mb-1 flex items-center space-x-2  ${category.children.length > 0 ? 'mt-2' : ''}`}
      >
        <Button
          onClick={() => setSelected(category)}
          variant='outline'
          size='icon'
          className='h-6 w-6'
        >
          <Icons.Edit className='h-4 w-4' />
        </Button>

        <Button
          onClick={() => handleRemoveCategory(category)}
          variant='outline'
          size='icon'
          className='h-6 w-6'
          disabled={category.children.length > 0}
        >
          <Icons.Trash className='h-4 w-4' />
        </Button>
        <Label className='pl-1'>{category.title}</Label>
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
