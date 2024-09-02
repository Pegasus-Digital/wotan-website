import { Category } from '@/payload/payload-types'

export interface NestedCategory {
  id: string
  title: string
  url: string
  children: NestedCategory[]
}

export function nestCategories(categories: Category[]): NestedCategory[] {
  const categoryMap = new Map<string, NestedCategory>()

  // Create a dictionary of categories by their IDs and initialize children arrays
  categories.forEach((category) => {
    categoryMap.set(category.id, {
      id: category.id,
      title: category.title,
      url: category.breadcrumbs.at(-1)?.url ?? '',
      children: [],
    })
  })

  // Build the nested structure
  categories.forEach((category) => {
    if (category.parent && typeof category.parent === 'object') {
      const parentCategory = categoryMap.get(category.parent.id)
      if (parentCategory) {
        parentCategory.children.push(categoryMap.get(category.id)!)
      }
    }
  })

  // Find and return top-level categories, inverting the array
  const topLevelCategories = Array.from(categoryMap.values())
    .filter(
      (category) =>
        !categories.find((cat) => cat.id === category.id && cat.parent),
    )
    .reverse()

  return topLevelCategories
}
