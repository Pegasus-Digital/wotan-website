'use client'

import { useEffect, useState } from 'react'

import { NestedCategory, nestCategories } from '@/lib/category-hierarchy'

import { Category } from '@/payload/payload-types'

import { toast } from 'sonner'

import { CategorySpan } from './category-span'
import { Dialog } from '@/components/ui/dialog'
import { UpdateCategoryDialog } from './update-category-dialog'

import { deleteCategory } from '../_logic/actions'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  const nestedCategories = nestCategories(categories)

  async function handleRemoveCategory(category: NestedCategory) {
    if (category.children.length > 0) {
      toast.error(
        'Não é possível remover uma categoria com categorias internas. Remova as categorias internas antes de continuar.',
      )
      return
    }

    const response = await deleteCategory(category.id)

    if (response.status === true) {
      toast.success(response.message)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  const [open, setOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState<NestedCategory | undefined>()

  useEffect(() => {
    if (selected && open === false) setOpen(true)
    if (selected && open === true) setOpen(false)
  }, [selected])

  return (
    <div className='space-y-1'>
      <Dialog open={open} onOpenChange={setOpen}>
        {nestedCategories.map((category) => (
          <div key={category.id}>
            <CategorySpan
              category={category}
              handleRemoveCategory={handleRemoveCategory}
              setOpen={setOpen}
              setSelected={setSelected}
            />
          </div>
        ))}

        {selected && (
          <UpdateCategoryDialog
            setOpen={setOpen}
            categories={categories}
            category={categories.find(
              (category) => category.id === selected.id,
            )}
          />
        )}
      </Dialog>
    </div>
  )
}
