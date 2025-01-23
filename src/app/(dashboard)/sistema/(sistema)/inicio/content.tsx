'use client'

import { formatBRL } from '@/lib/format'

import { Separator } from '@/components/ui/separator'
import { Card, CardHeader } from '@/components/ui/card'
import { Content, ContentHeader } from '@/components/content'

import { Large, Small } from '@/components/typography/texts'
import { Heading } from '@/pegasus/heading'
import { ContentLayoutSales } from '@/components/painel-sistema/content-layout'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'

const ordersData = [
  { mes: 'JAN', pedidos: 400, orcamentos: 100 },
  { mes: 'FEV', pedidos: 300, orcamentos: 150 },
  { mes: 'MAR', pedidos: 500, orcamentos: 80 },
  { mes: 'ABR', pedidos: 200, orcamentos: 120 },
  { mes: 'MAI', pedidos: 400, orcamentos: 170 },
  { mes: 'JUN', pedidos: 450, orcamentos: 140 },
  { mes: 'JUL', pedidos: 500, orcamentos: 160 },
  { mes: 'AGO', pedidos: 480, orcamentos: 180 },
  { mes: 'SET', pedidos: 470, orcamentos: 200 },
]

// const budgetsData = [
//   { mes: 'JAN', orcamentos: 100 },
//   { mes: 'FEV', orcamentos: 150 },
//   { mes: 'MAR', orcamentos: 80 },
//   { mes: 'ABR', orcamentos: 120 },
//   { mes: 'MAI', orcamentos: 170 },
//   { mes: 'JUN', orcamentos: 140 },
//   { mes: 'JUL', orcamentos: 160 },
//   { mes: 'AGO', orcamentos: 180 },
//   { mes: 'SET', orcamentos: 200 },
// ]

const productsData = [
  { nome: 'Produto A', vendas: 200 },
  { nome: 'Produto B', vendas: 100 },
  { nome: 'Produto C', vendas: 300 },
  { nome: 'Produto D', vendas: 150 },
  { nome: 'Produto E', vendas: 250 },
]

const performanceData = [
  { produto: 'A', vendas: 240, orcamentos: 120 },
  { produto: 'B', vendas: 130, orcamentos: 90 },
  { produto: 'C', vendas: 280, orcamentos: 170 },
  { produto: 'D', vendas: 200, orcamentos: 140 },
  { produto: 'E', vendas: 260, orcamentos: 200 },
]

const scatterData = [
  { x: 100, y: 200 },
  { x: 120, y: 100 },
  { x: 170, y: 300 },
  { x: 140, y: 250 },
  { x: 150, y: 400 },
]
export function DashboardContent() {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Dashboard'
    //     description='Analise com facilidade as recentes movimentações.'
    //   />
    <ContentLayoutSales title='Início'>
      {/* <Separator className='mb-4' /> */}

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Orders Line Chart */}
        <div className='rounded-lg bg-white p-6 shadow-lg'>
          <h2 className='mb-4 text-xl font-semibold'>Pedidos por Mês</h2>
          <LineChart width={500} height={300} data={ordersData}>
            <CartesianGrid stroke='#ccc' />
            <XAxis dataKey='mes' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type='monotone' dataKey='pedidos' stroke='#8884d8' />
            <Line type='natural' dataKey='orcamentos' stroke='#82ca9d' />
          </LineChart>
        </div>

        {/* Budgets Area Chart */}
        {/* <div className='rounded-lg bg-white p-6 shadow-lg'>
          <h2 className='mb-4 text-xl font-semibold'>Orçamentos por Mês</h2>
          <AreaChart width={500} height={300} data={budgetsData}>
            <CartesianGrid stroke='#ccc' />
            <XAxis dataKey='mes' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type='monotone'
              dataKey='orcamentos'
              stroke='#82ca9d'
              fill='#82ca9d'
            />
          </AreaChart>
        </div> */}

        {/* Products Pie Chart */}
        <div className='rounded-lg bg-white p-6 shadow-lg'>
          <h2 className='mb-4 text-xl font-semibold'>Vendas de Produtos</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={productsData}
              dataKey='vendas'
              nameKey='nome'
              cx='50%'
              cy='50%'
              outerRadius={100}
              fill='#8884d8'
              label
            />
            <Tooltip />
          </PieChart>
        </div>

        {/* Product Performance Radar Chart */}
        <div className='rounded-lg bg-white p-6 shadow-lg'>
          <h2 className='mb-4 text-xl font-semibold'>Desempenho de Produtos</h2>
          <RadarChart
            outerRadius={90}
            width={500}
            height={300}
            data={performanceData}
          >
            <PolarGrid />
            <PolarAngleAxis dataKey='produto' />
            <PolarRadiusAxis />
            <Radar
              name='Vendas'
              dataKey='vendas'
              stroke='#8884d8'
              fill='#8884d8'
              fillOpacity={0.6}
            />
            <Radar
              name='Orçamentos'
              dataKey='orcamentos'
              stroke='#82ca9d'
              fill='#82ca9d'
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </div>

        {/* Scatter Chart Example */}
        <div className='rounded-lg bg-white p-6 shadow-lg'>
          <h2 className='mb-4 text-xl font-semibold'>Relação entre Fatores</h2>
          <ScatterChart width={500} height={300}>
            <CartesianGrid />
            <XAxis type='number' dataKey='x' name='Orçamentos' />
            <YAxis type='number' dataKey='y' name='Vendas' />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name='Produtos' data={scatterData} fill='#8884d8' />
          </ScatterChart>
        </div>
      </div>
    </ContentLayoutSales>
    // </Content>
  )
}
