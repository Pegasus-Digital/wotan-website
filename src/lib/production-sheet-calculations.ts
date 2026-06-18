import { Layout } from '@/payload/payload-types'

type ProductionSheetLayout = Pick<
  Layout,
  | 'printing'
  | 'printing2'
  | 'supplyer'
  | 'additionalCosts'
  | 'additionalCosts2'
  | 'delivery'
  | 'delivery2'
  | 'commisions'
>

export interface ProductionSheetCalculationInput {
  quantity: number
  /** Preço unitário em centavos */
  price: number
  additionals: number
  /** Quando false, ignora additionals no valor total e no resultado */
  includeAdditionals?: boolean | null
  layout: ProductionSheetLayout
}

export interface ProductionSheetCalculations {
  valorDaVenda: number
  valorTotal: number
  deliveryTotal: number
  additionalCostsTotal: number
  agencyComission: number
  salespersonComission: number
  custoImpressaoEMateriais: number
  custoDeProducao: number
  resultado: number
}

export function calculateProductionSheet({
  quantity,
  price,
  additionals,
  includeAdditionals = true,
  layout,
}: ProductionSheetCalculationInput): ProductionSheetCalculations {
  const valorDaVenda = (quantity * price) / 100
  const outrosNoCalculo = includeAdditionals !== false ? additionals : 0
  const valorTotal = valorDaVenda + outrosNoCalculo

  const deliveryTotal =
    ((layout.delivery?.cost ?? 0) + (layout.delivery2?.cost ?? 0)) / 100

  const additionalCostsTotal =
    ((layout.additionalCosts?.cost ?? 0) +
      (layout.additionalCosts2?.cost ?? 0)) /
    100

  // const baseDeCalculo = valorDaVenda + outrasDespesas

  const agencyComission =
    (valorDaVenda * Number(layout.commisions?.agency?.value ?? 0)) / 100
  const salespersonComission =
    ((valorDaVenda - agencyComission) *
      Number(layout.commisions?.salesperson?.value ?? 0)) /
    100

  const custoImpressaoCentavos =
    (layout.printing?.price ?? 0) * (layout.printing?.quantity ?? 0) +
    (layout.printing2?.price ?? 0) * (layout.printing2?.quantity ?? 0)

  const custoMateriaisCentavos = (layout.supplyer ?? []).reduce((acc, s) => {
    const custo = s.custo_material ?? 0
    const qtd = s.quantidade_material ?? 1
    return acc + custo * qtd
  }, 0)

  const custoImpressaoEMateriais =
    (custoImpressaoCentavos + custoMateriaisCentavos) / 100

  const custoDeProducao =
    custoImpressaoEMateriais +
    // deliveryTotal +
    additionalCostsTotal +
    agencyComission +
    salespersonComission

  const resultado = valorTotal - custoDeProducao

  return {
    valorDaVenda,
    valorTotal,
    deliveryTotal,
    additionalCostsTotal,
    agencyComission,
    salespersonComission,
    custoImpressaoEMateriais,
    custoDeProducao,
    resultado,
  }
}
