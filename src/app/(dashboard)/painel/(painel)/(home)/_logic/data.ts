import payload from 'payload'
import { getLast12MonthDateRanges } from './helpers'

export async function getOrdersData() {

  const ranges = getLast12MonthDateRanges()

  const monthlyFindPromises = ranges.map(({ start, end }) =>
    payload.find({
      collection: 'order',
      pagination: false,
      where: {
        and: [
          { createdAt: { greater_than_equal: start.toISOString() } },
          { createdAt: { less_than_equal: end.toISOString() } },
        ],
      },
      sort: 'createdAt',
    }),
  )

  const monthlyResults = await Promise.all(monthlyFindPromises)

  const orders = monthlyResults.map((res, index) => {
    const { start, end } = ranges[index]
    const currentYear = new Date().getUTCFullYear()
    const monthShort = new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      timeZone: 'UTC',
    })
      .format(start)
      .replace('.', '')
      .toLowerCase()
      .slice(0, 3)
    const label =
      start.getUTCFullYear() === currentYear
        ? monthShort
        : `${monthShort} ${start.getUTCFullYear()}`
    const orders = res?.docs ?? []
    const totalCents = (orders as any[]).reduce((sum: number, order: any) => {
      const items = Array.isArray(order?.itens) ? order.itens : []
      const orderCents = items.reduce((acc: number, item: any) => {
        const qty = Number(item?.quantity) || 0
        const priceCents = Number(item?.price) || 0
        return acc + qty * priceCents
      }, 0)
      return sum + orderCents
    }, 0)
    const totalBRL = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(totalCents / 100)
    return {
      label,
      // start,
      // end,
      count: Array.isArray(orders) ? orders.length : 0,
      // orders,
      total: totalBRL,
      totalCents,
    }
  })

  return  orders 
}

export async function getBudgetsData() {
  const ranges = getLast12MonthDateRanges()

  const monthlyFindPromises = ranges.map(({ start, end }) =>
    payload.find({
      collection: 'budget',
      pagination: false,
      where: {
        and: [
          { createdAt: { greater_than_equal: start.toISOString() } },
          { createdAt: { less_than_equal: end.toISOString() } },
        ],
      },
      sort: 'createdAt',
      depth: 5, 
    }),
  )

  const monthlyResults = await Promise.all(monthlyFindPromises)

  const budgets = monthlyResults.map((res, index) => {
    const { start, end } = ranges[index]
    const currentYear = new Date().getUTCFullYear()
    const monthShort = new Intl.DateTimeFormat('pt-BR', {
      month: 'short',
      timeZone: 'UTC',
    })
      .format(start)
      .replace('.', '')
      .toLowerCase()
      .slice(0, 3)
    const label =
      start.getUTCFullYear() === currentYear
        ? monthShort
        : `${monthShort} ${start.getUTCFullYear()}`
    
    const budgets = res?.docs ?? []
    
    // Count product frequency in this month
    const productCount = new Map<string, { count: number; product: any }>()
    
    budgets.forEach((budget: any) => {
      const items = Array.isArray(budget?.items) ? budget.items : []
      items.forEach((item: any) => {
        if (item?.product) {
          const productId = typeof item.product === 'string' ? item.product : item.product.id
          const productData = typeof item.product === 'object' ? item.product : item.product
          
          if (productCount.has(productId)) {
            productCount.get(productId)!.count += 1
          } else {
            productCount.set(productId, { count: 1, product: productData })
          }
        }
      })
    })
    
    const topProducts = Array.from(productCount.entries())
      .map(([productId, data]) => ({
        productId,
        // product: data.product,
        count: data.count,
        title: typeof data.product === 'object' ? data.product.title : productId,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      label,
      // start,
      // end,
      count: Array.isArray(budgets) ? budgets.length : 0,
      // budgets,
      topProducts,
    }
  })

  return budgets
}


export async function getDashboardData() {
  const orders = await getOrdersData()
  const budgets = await getBudgetsData()
  return { orders, budgets }
}
