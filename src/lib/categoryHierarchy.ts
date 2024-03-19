import { Category } from '@/payload/payload-types'

export interface NestedCategory {
  id: string
  title: string
  url: string
  children: NestedCategory[]
}

export function nestCategories(categories: Category[]): NestedCategory[] {
  const categoryMap: Map<string, NestedCategory> = new Map()

  // Create a dictionary of categories by their IDs
  for (const category of categories) {
    categoryMap.set(category.id, {
      id: category.id,
      title: category.title,
      url: category.breadcrumbs[category.breadcrumbs.length - 1]?.url || '',
      children: [],
    })
  }

  // Traverse the categories to build the nested structure
  for (const category of categories) {
    if (category.parent && typeof category.parent === 'object') {
      const parentCategory = categoryMap.get(category.parent.id)
      if (parentCategory) {
        parentCategory.children.push(categoryMap.get(category.id)!)
      }
    }
  }

  // Find and return top-level categories
  const topLevelCategories: NestedCategory[] = []
  for (const category of categories) {
    if (!category.parent) {
      topLevelCategories.push(categoryMap.get(category.id)!)
    }
  }

  return topLevelCategories
}
