import { NestedCategory } from '@/lib/category-hierarchy'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface CategoryListProps {
  categories: NestedCategory[]
  field: any
  set: (name: string, value: any) => void
  readonly?: boolean
}

export function CategoryList({
  categories,
  field,
  set,
  readonly = false,
}: CategoryListProps) {
  return (
    <div className='space-y-2'>
      {categories.map((category) => (
        <CategoryCheckbox
          key={category.id}
          category={category}
          field={field}
          set={set}
          readonly={readonly}
        />
      ))}
    </div>
  )
}

interface CategoryCheckboxProps {
  category: NestedCategory
  field: any
  set: (name: string, value: any) => void
  readonly?: boolean
}

export function CategoryCheckbox({
  category,
  field,
  set,
  readonly = false,
}: CategoryCheckboxProps) {
  function handleCheckedChange(id: string, state: boolean) {
    state
      ? field.value.push(id)
      : (field.value = field.value.filter(
          (categoryId: any) => categoryId !== id,
        ))

    set('categories', field.value)
  }

  return (
    <div className='ml-4 space-y-2'>
      <div className='group flex items-center gap-1.5'>
        <Checkbox
          id={category.id}
          name={category.title}
          value={category.id}
          disabled={readonly}
          defaultChecked={field.value.includes(category.id)}
          onCheckedChange={(state) => handleCheckedChange(category.id, !!state)}
        />
        <Label
          className='cursor-pointer hover:underline group-hover:underline'
          htmlFor={category.id}
        >
          {category.title}
        </Label>
      </div>

      {category.children.map((childCategory) => (
        <CategoryCheckbox
          key={childCategory.id}
          category={childCategory}
          field={field}
          set={set}
        />
      ))}
    </div>
  )
}
