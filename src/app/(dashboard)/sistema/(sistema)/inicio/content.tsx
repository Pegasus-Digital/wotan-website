'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CardDescription } from '@/components/ui/card'

import { ContentLayout } from '@/components/painel-sistema/content-layout'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'

const ordersChartConfig: ChartConfig = {
  totalCents: { label: 'Total', color: 'hsl(var(--primary))' },
  count: { label: 'Pedidos', color: 'hsl(var(--primary))' },
} satisfies ChartConfig

const budgetsChartConfig: ChartConfig = {
  count: { label: 'Orçamentos', color: 'hsl(var(--secondary))' },
} satisfies ChartConfig

export function DashboardContent({
  orders,
  budgets,
}: {
  orders: any[]
  budgets: any[]
}) {
  console.log(budgets)

  return (
    <ContentLayout title='Dashboard'>
      <div className='grid grid-cols-1 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>
              Pedidos realizados nos últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={ordersChartConfig}
              className='max-h-96 w-full'
            >
              <BarChart accessibilityLayer data={orders}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null

                    const data = payload[0].payload

                    return (
                      <div className='grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl'>
                        <div className='grid gap-1.5'>
                          <div className='flex w-full flex-wrap items-center gap-2'>
                            <div
                              className='h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]'
                              style={
                                {
                                  '--color-bg': 'hsl(var(--primary))',
                                  '--color-border': 'hsl(var(--primary))',
                                } as React.CSSProperties
                              }
                            />
                            <div className='flex flex-1 items-center justify-between leading-none'>
                              <span className='text-muted-foreground'>
                                Pedidos
                              </span>
                              <span className='font-mono font-medium tabular-nums text-foreground'>
                                {data.count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey='totalCents' fill='hsl(var(--primary))' radius={8}>
                  <LabelList dataKey='total' position='top' />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orçamentos e Produtos por Mês</CardTitle>
            <CardDescription>
              Orçamentos realizados nos últimos 12 meses - Passe o mouse para
              ver os produtos mais solicitados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={budgetsChartConfig}
              className='max-h-96 w-full'
            >
              <BarChart accessibilityLayer data={budgets}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null

                    const data = payload[0].payload

                    return (
                      <div className='grid min-w-[12rem] max-w-[24rem] items-start gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl'>
                        <div className='grid gap-2'>
                          {/* Budget count */}
                          <div className='flex w-full flex-wrap items-center gap-2'>
                            <div
                              className='h-2.5 w-2.5 shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]'
                              style={
                                {
                                  '--color-bg': 'hsl(var(--secondary))',
                                  '--color-border': 'hsl(var(--secondary))',
                                } as React.CSSProperties
                              }
                            />
                            <div className='flex flex-1 items-center justify-between leading-none'>
                              <span className='text-muted-foreground'>
                                Orçamentos
                              </span>
                              <span className='font-mono font-medium tabular-nums text-foreground'>
                                {data.count}
                              </span>
                            </div>
                          </div>

                          {/* Top products */}
                          {data.topProducts && data.topProducts.length > 0 && (
                            <div className='border-t pt-2'>
                              <div className='mb-1 font-medium text-muted-foreground'>
                                Produtos mais solicitados:
                              </div>
                              <div className='space-y-1'>
                                {data.topProducts.map(
                                  (product: any, index: number) => (
                                    <div
                                      key={index}
                                      className='flex items-center justify-between'
                                    >
                                      <div className='flex items-center gap-1.5'>
                                        <span className='flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-primary'>
                                          {index + 1}
                                        </span>
                                        <span className='max-w-[120px] truncate text-[11px] text-foreground'>
                                          {product.title || 'Produto sem nome'}
                                        </span>
                                      </div>
                                      <span className='ml-2 text-[10px] text-muted-foreground'>
                                        {product.count}x
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }}
                />
                <Bar dataKey='count' fill='hsl(var(--secondary))' radius={8}>
                  <LabelList dataKey='count' position='top' />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}
