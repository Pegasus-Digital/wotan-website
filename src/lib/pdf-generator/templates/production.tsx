import { getDDMMYYDate } from '../../date'

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

import {
  DocumentFiller,
  DocumentSeparator,
  DocumentVerticalSeparator,
} from '../components/document-separator'
import { DocumentHeader } from '../components/document-header'
import { AttributeType, Layout, Order } from '@/payload/payload-types'
import { formatBRL, formatCNPJ } from '@/lib/format'
import {
  DEFAULT_PRINTING_TYPES,
  formatPrintingTypeLabel,
  PrintingTypeOption,
} from '@/lib/printing-types'
import { calculateProductionSheet } from '@/lib/production-sheet-calculations'
import { resolveOrderContact } from '@/lib/order-contact'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    fontSize: 12,
  },
  section: {
    marginHorizontal: 8,
    padding: 8,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'stretch',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  footer_column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
})

interface ProductionDocumentProps {
  order: Order
  layoutItem: Order['itens'][number]
  printingTypes?: PrintingTypeOption[]
}

function hasPrinting2Content(printing2?: Layout['printing2']): boolean {
  if (!printing2) return false

  return Boolean(
    printing2.type ||
      printing2.colors ||
      printing2.supplyer ||
      (printing2.quantity ?? 0) > 0 ||
      (printing2.price ?? 0) > 0,
  )
}

export function ProductionDocument({
  layoutItem,
  order,
  printingTypes = DEFAULT_PRINTING_TYPES,
}: ProductionDocumentProps) {
  const client = typeof order.client === 'object' ? order.client : null

  const contact = resolveOrderContact(order, client)

  const attributes =
    typeof layoutItem.attributes === 'object'
      ? layoutItem.attributes.map((attr) => {
          return typeof attr === 'object' ? attr : null
        })
      : []

  const layoutValues =
    typeof layoutItem.layout === 'object' ? layoutItem.layout : null

  const additionals = (order.additionals ?? 0) / 100
  const includeAdditionals = layoutValues?.includeAdditionals ?? true

  const {
    valorDaVenda,
    deliveryTotal,
    additionalCostsTotal,
    agencyComission,
    salespersonComission,
    valorTotal,
    custoDeProducao,
    resultado,
  } = calculateProductionSheet({
    quantity: layoutItem.quantity,
    price: layoutItem.price,
    additionals,
    includeAdditionals,
    layout: layoutValues ?? {},
  })

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <DocumentHeader />
        <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
          PLANILHA DE PRODUÇÃO
        </Text>
        <View style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 120,
              marginTop: 8,
              marginBottom: 12,
            }}
          >
            <Text>Pedido n°: {order.incrementalId}</Text>
            <Text>Data: {getDDMMYYDate(new Date(order.updatedAt))}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              fontSize: 10,
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                width: '35%',
                paddingRight: 4,
              }}
            >
              <Text style={{ fontWeight: 'medium', fontSize: 10 }}>
                Produto:{' '}
                {typeof layoutItem.product === 'string'
                  ? layoutItem.product
                  : layoutItem.product.sku + ' - ' + layoutItem.product.title}
              </Text>
              <Text>Quantidade: {layoutItem.quantity}</Text>
              {attributes &&
                attributes.map((attr) => {
                  const attributeType = attr.type as AttributeType
                  return (
                    <Text key={attr.id}>
                      {attributeType.name}: {attr.name}
                    </Text>
                  )
                })}
              <Text>
                Pz entrega: {order.shippingTime} {'   '} Pgto:{' '}
                {order.paymentConditions}
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                width: '65%',
                paddingLeft: 4,
              }}
            >
              <Text style={{ fontWeight: 'medium', fontSize: 10 }}>
                Razão social:{' '}
                {typeof client === 'object' ? client.razaosocial : client}
              </Text>
              <Text>
                CNPJ:{' '}
                {typeof client === 'object'
                  ? formatCNPJ(client.document ?? '')
                  : client}
              </Text>
              <Text>
                Contato:{' '}
                {typeof contact === 'object' && contact
                  ? contact.name
                  : 'Não cadastrado.'}{' '}
              </Text>
              <Text>Email: {contact.email}</Text>
              <Text>
                Tel: {contact?.phone ?? 'N/A.'} {'   '} Wh:{' '}
                {contact?.whatsapp ?? 'N/A.'}{' '}
              </Text>
            </View>
          </View>
        </View>

        <DocumentSeparator />

        {/* Detalhes do produto */}
        <View
          style={{
            fontSize: 10,
            flexDirection: 'column',
            display: 'flex',
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          {/* Impressoes */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 16,
              marginTop: 10,
            }}
          >
            <View style={{ display: 'flex', width: '33%' }}>
              <Text>
                Tipo de Impressão:{' '}
                {formatPrintingTypeLabel(
                  layoutValues.printing.type,
                  printingTypes,
                )}
              </Text>
            </View>
            <View style={{ display: 'flex', width: '12%' }}>
              <Text>
                Cores:{' '}
                {layoutValues.printing.colors
                  ? layoutValues.printing.colors
                  : 'N.A.'}
              </Text>
            </View>
            <View style={{ display: 'flex', width: '20%' }}>
              <Text>Fornecedor: {layoutValues.printing.supplyer}</Text>
            </View>

            <View style={{ display: 'flex', width: '20%' }}>
              <Text>Quantidade: {layoutValues.printing.quantity}</Text>
            </View>

            <View style={{ display: 'flex', width: '15%' }}>
              <Text>
                Custo: {formatBRL(layoutValues.printing.price / 100)} un
              </Text>
            </View>
          </View>
          {hasPrinting2Content(layoutValues.printing2) && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 16,
              }}
            >
              <View style={{ display: 'flex', width: '33%' }}>
                <Text>
                  Tipo de Impressão:{' '}
                  {formatPrintingTypeLabel(
                    layoutValues.printing2.type,
                    printingTypes,
                  )}
                </Text>
              </View>
              <View style={{ display: 'flex', width: '12%' }}>
                <Text>
                  Cores:{' '}
                  {layoutValues.printing2.colors
                    ? layoutValues.printing2.colors
                    : 'N.A.'}
                </Text>
              </View>
              <View style={{ display: 'flex', width: '20%' }}>
                <Text>Fornecedor: {layoutValues.printing2.supplyer}</Text>
              </View>

              <View style={{ display: 'flex', width: '20%' }}>
                <Text>Quantidade: {layoutValues.printing2.quantity}</Text>
              </View>

              <View style={{ display: 'flex', width: '15%' }}>
                <Text>
                  Custo: {formatBRL(layoutValues.printing2.price / 100)} un
                </Text>
              </View>
            </View>
          )}

          {/* Fornecedores/Materiais*/}
          {layoutValues.supplyer.map((supplyer) => {
            return (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 16,
                  marginTop: 10,
                }}
              >
                <View style={{ display: 'flex', width: '45%' }}>
                  <Text>Material: {supplyer.material}</Text>
                </View>

                <View style={{ display: 'flex', width: '20%' }}>
                  <Text>Fornecedor: {supplyer.fornecedor_material}</Text>
                </View>

                <View style={{ display: 'flex', width: '20%' }}>
                  <Text>Quantidade: {supplyer.quantidade_material}</Text>
                </View>

                <View style={{ display: 'flex', width: '15%' }}>
                  <Text>
                    Custo: {formatBRL(supplyer.custo_material / 100)} un
                  </Text>
                </View>
              </View>
            )
          })}

          {/* <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            <View style={{ display: 'flex', width: '85%' }}>
              <Text>Observações: {layoutValues.additionalCosts.obs}</Text>
            </View>
            <View style={{ display: 'flex', width: '15%' }}>
              <Text>
                Custo: {formatBRL(layoutValues.additionalCosts.cost / 100)}
              </Text>
            </View>
          </View>

          {layoutValues.additionalCosts2 &&
            layoutValues.additionalCosts2.cost > 0 && (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginBottom: 16,
                }}
              >
                <View style={{ display: 'flex', width: '85%' }}>
                  <Text> Observações 2: {layoutValues.additionalCosts2.obs}</Text>
                </View>
                <View style={{ display: 'flex', width: '15%' }}>
                  <Text>
                    Custo: {formatBRL(layoutValues.additionalCosts2.cost / 100)}
                  </Text>
                </View>
              </View>
            )} */}

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            <View style={{ display: 'flex', width: '85%' }}>
              <Text>Frete: {layoutValues.additionalCosts.obs}</Text>
            </View>
            <View style={{ display: 'flex', width: '15%' }}>
              <Text>
                Custo: {formatBRL(layoutValues.additionalCosts.cost / 100)}
              </Text>
            </View>
          </View>
          {layoutValues.additionalCosts2 && layoutValues.additionalCosts2.cost > 0 && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 16,
              }}
            >
              <View style={{ display: 'flex', width: '85%' }}>
                <Text>Frete 2: {layoutValues.additionalCosts2.obs}</Text>
              </View>
              <View style={{ display: 'flex', width: '15%' }}>
                <Text>
                  Custo: {formatBRL(layoutValues.additionalCosts2.cost / 100)}
                </Text>
              </View>
            </View>
          )}
          {/* Comissões  */}
          <>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 16,
                marginTop: 16,
              }}
            >
              <View style={{ display: 'flex', width: '65%' }}>
                <Text>
                  Comissão Agência:{' '}
                  {layoutValues.commisions.agency?.name ?? '—'}
                </Text>
              </View>
              <View style={{ display: 'flex', width: '20%' }}>
                <Text>
                  Porcentagem: {layoutValues.commisions.agency?.value ?? 0}%
                </Text>
              </View>
              <View style={{ display: 'flex', width: '15%' }}>
                <Text>Valor: {formatBRL(agencyComission)}</Text>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 16,
              }}
            >
              <View style={{ display: 'flex', width: '65%' }}>
                <Text>
                  Comissão Vendedor:{' '}
                  {layoutValues.commisions.salesperson?.name ?? '—'}
                </Text>
              </View>
              <View style={{ display: 'flex', width: '20%' }}>
                <Text>
                  Porcentagem: {layoutValues.commisions.salesperson?.value ?? 0}
                  %
                </Text>
              </View>
              <View style={{ display: 'flex', width: '15%' }}>
                <Text>Valor: {formatBRL(salespersonComission)}</Text>
              </View>
            </View>
          </>

          {/* Layout/Amostra */}
          <View>
            <Text style={{ marginBottom: 4 }}>Layout:</Text>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text>
              Enviado ({layoutValues.layout.sent ? 'X' : ' '}){'   '}Aprovado (
              {layoutValues.layout.approved ? 'X' : ' '}){'   '}Idem ao anterior
              ({layoutValues.layout.sameAsPrevious ? 'X' : ' '}){'   '}Reenviado
              ({layoutValues.layout.reSent ? 'X' : ' '}){'   '}Fotolito (
              {layoutValues.layout.fotolitus ? 'X' : ' '})
            </Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View>
              <Text style={{ marginBottom: 4 }}>Amostra: </Text>
              <Text style={{}}>
                Com ({layoutValues.sample.with ? 'X' : ' '}){'  '}Sem (
                {!layoutValues.sample.with ? 'X' : ' '})
              </Text>
            </View>
            <View style={{ marginLeft: 24 }}>
              <Text style={{ marginBottom: 4 }}>Aprovação:</Text>
              <Text style={{}}>
                Sim ({layoutValues.sample.approved ? 'X' : ' '}){'  '}Não (
                {!layoutValues.sample.approved ? 'X' : ' '})
              </Text>
            </View>
            <View style={{ marginLeft: 24 }}>
              <Text style={{ marginBottom: 4 }}>Nova Amostra:</Text>
              <Text style={{}}>
                Sim ({layoutValues.sample.new ? 'X' : ' '}){'  '}Não (
                {!layoutValues.sample.new ? 'X' : ' '})
              </Text>
            </View>
          </View>
        </View>
        <DocumentSeparator />

        <View style={styles.section}>
          <View style={styles.footer}>
            <View style={styles.footer_column}>
              <Text>Valor unitário: {formatBRL(layoutItem.price / 100)}</Text>
              <Text>Valor da venda: {formatBRL(valorDaVenda)}</Text>
              <Text>
                Outros: {formatBRL(additionals)}
              </Text>
              <Text>
                Valor total:
                {formatBRL(valorTotal)}
              </Text>
              <Text>Custo de produção: {formatBRL(custoDeProducao)}</Text>
              <Text>Resultado: {formatBRL(resultado)}</Text>
            </View>
            <DocumentVerticalSeparator />
            <View style={styles.footer_column}>
              <Text>
                Frete:{' '}
                {layoutValues.shipmentType &&
                  layoutValues.shipmentType.toUpperCase()}
              </Text>
              <Text>Transportadora: {layoutValues.transp}</Text>
              <Text>Prazo de entrega: {layoutValues.prazoentrega}</Text>
              <Text>Cotação: {layoutValues.quote}</Text>
              <Text>Volumes: {layoutValues.volumeNumber}</Text>
              <Text>Peso: {layoutValues.volumeWeight}</Text>
            </View>
            <DocumentVerticalSeparator />
            <View style={styles.footer_column}>
              <Text>N° pedido: {layoutValues.orderN}</Text>
              <Text>Tipo de pagamento: {layoutValues.paymentType}</Text>
              <Text>Nota fiscal nº: {layoutValues.invoice.number}</Text>
              <Text>Vencimento: {layoutValues.invoice.due}</Text>
              <Text>Valor: {formatBRL(layoutValues.invoice.value / 100)}</Text>
              <Text>NCM:{layoutValues.ncm}</Text>
            </View>
          </View>
        </View>
        {layoutValues.obs_final && <DocumentSeparator />}

        <View style={[styles.section, { gap: 2, fontSize: 10, marginTop: 4 }]}>
          {layoutValues.obs_final && <Text>Observações:</Text>}

          {layoutValues.obs_final && <Text>{layoutValues.obs_final}</Text>}
        </View>
        <DocumentFiller />
      </Page>
    </Document>
  )
}
