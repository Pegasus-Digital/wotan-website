import { getDDMMYYDate } from '../../date'

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

import {
  DocumentFiller,
  DocumentSeparator,
} from '../components/document-separator'
import { DocumentHeader } from '../components/document-header'
import { AttributeType, Order } from '@/payload/payload-types'
import { formatBRL } from '@/lib/format'

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    fontSize: 12,
  },
  section: {
    marginHorizontal: 10,
    padding: 10,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
  },
  footer_column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
})

interface ProductionDocumentProps {
  order: Order
  layoutItem: Order['itens'][number]
}

export function ProductionDocument({
  layoutItem,
  order,
}: ProductionDocumentProps) {
  const client = typeof order.client === 'object' ? order.client : null

  const contact = client.contacts.filter(
    (contact) => contact.id === order.contact,
  )

  const attributes = layoutItem.attributes.map((attr) => {
    return typeof attr === 'object' ? attr : null
  })

  const layoutValues =
    typeof layoutItem.layout === 'object' ? layoutItem.layout : null

  const totalValue = (layoutItem.quantity * layoutItem.price) / 100

  const agencyComission =
    (totalValue * Number(layoutValues.commisions.agency.value)) / 100
  const salespersonComission =
    (totalValue * Number(layoutValues.commisions.salesperson.value)) / 100

  const productUnitCost =
    layoutValues.printing.price +
    layoutValues.printing2.price +
    layoutValues.supplyer.reduce((acc, curr) => acc + curr.custo_material, 0)

  const productionCost =
    (productUnitCost * layoutItem.quantity) / 100 +
    (layoutValues.additionalCosts.cost + layoutValues.additionalCosts2.cost) /
      100 +
    agencyComission +
    salespersonComission

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <DocumentHeader />

        <View style={styles.section}>
          <Text
            style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}
          >
            PLANILHA DE PRODUÇÃO
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 120,
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            <Text>Pedido n°:{order.incrementalId}</Text>
            <Text>Data: {getDDMMYYDate(new Date(order.updatedAt))}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              fontSize: 10,
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Text style={{ fontWeight: 'medium', fontSize: 12 }}>
                Produto:{' '}
                {typeof layoutItem.product === 'string'
                  ? layoutItem.product
                  : layoutItem.product.sku + ' - ' + layoutItem.product.title}
              </Text>
              <View style={{ marginLeft: 10, fontSize: 11 }}>
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
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Text style={{ fontWeight: 'medium', fontSize: 11 }}>
                Razão social:{' '}
                {typeof client === 'object' ? client.name : client}
              </Text>
              <Text>
                CNPJ: {typeof client === 'object' ? client.document : client}
              </Text>
              <Text>Contato: {contact[0].name}</Text>
              <Text>Condição de pagamento: {order.paymentConditions}</Text>
              <Text>Prazo de entrega: {layoutValues.prazoentrega}</Text>
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
              <Text>Tipo de Impressão: {layoutValues.printing.type}</Text>
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
          {layoutValues.printing2 && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 16,
              }}
            >
              <View style={{ display: 'flex', width: '33%' }}>
                <Text>Tipo de Impressão: {layoutValues.printing2.type}</Text>
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

          {/* Observações */}
          <View
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
                  <Text>
                    Observações 2: {layoutValues.additionalCosts2.obs}
                  </Text>
                </View>
                <View style={{ display: 'flex', width: '15%' }}>
                  <Text>
                    Custo: {formatBRL(layoutValues.additionalCosts2.cost / 100)}
                  </Text>
                </View>
              </View>
            )}

          {/* Fretes */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            <View style={{ display: 'flex', width: '85%' }}>
              <Text>Frete: {layoutValues.delivery.company}</Text>
            </View>
            <View style={{ display: 'flex', width: '15%' }}>
              <Text>Custo: {formatBRL(layoutValues.delivery.cost / 100)}</Text>
            </View>
          </View>
          {layoutValues.delivery2 && layoutValues.delivery2.cost > 0 && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 16,
              }}
            >
              <View style={{ display: 'flex', width: '85%' }}>
                <Text>Frete 2: {layoutValues.delivery2.company}</Text>
              </View>
              <View style={{ display: 'flex', width: '15%' }}>
                <Text>
                  Custo: {formatBRL(layoutValues.delivery2.cost / 100)}
                </Text>
              </View>
            </View>
          )}
          {/* Comissões  */}
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
                Comissão Agência: {layoutValues.commisions.agency.name}
              </Text>
            </View>
            <View style={{ display: 'flex', width: '20%' }}>
              <Text>Porcentagem: {layoutValues.commisions.agency.value}%</Text>
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
                Comissão Vendedor: {layoutValues.commisions.salesperson.name}
              </Text>
            </View>
            <View style={{ display: 'flex', width: '20%' }}>
              <Text>
                Porcentagem: {layoutValues.commisions.salesperson.value}%
              </Text>
            </View>
            <View style={{ display: 'flex', width: '15%' }}>
              <Text>Valor: {formatBRL(salespersonComission)}</Text>
            </View>
          </View>

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
        <DocumentFiller />
        <DocumentSeparator />

        <View style={styles.section}>
          <View style={styles.footer}>
            <View style={styles.footer_column}>
              <Text>Valor unitário: {formatBRL(layoutItem.price / 100)}</Text>
              <Text>
                Custo adicional:{' '}
                {formatBRL(
                  (layoutValues.additionalCosts.cost +
                    layoutValues.additionalCosts2.cost) /
                    100,
                )}
              </Text>
              <Text>Valor da venda: {formatBRL(totalValue)}</Text>
              <Text>Custo de produção: {formatBRL(productionCost)}</Text>
              <Text>Resultado: {formatBRL(totalValue - productionCost)}</Text>
            </View>
            <View style={styles.footer_column}>
              <Text>Frete: {layoutValues.shipmentType.toUpperCase()}</Text>
              <Text>
                Valor do frete:{' '}
                {formatBRL(
                  (layoutValues.delivery.cost + layoutValues.delivery2.cost) /
                    100,
                )}
              </Text>
              <Text>Transportadora: {layoutValues.transp}</Text>
              <Text>Prazo de entrega: {layoutValues.prazoentrega}</Text>
              <Text>Cotação: {layoutValues.quote}</Text>
              <Text>Volumes: {layoutValues.volumeNumber}</Text>
            </View>
            <View style={styles.footer_column}>
              <Text>Data remessa: {layoutValues.shipmentDate}</Text>
              <Text>Tipo de pagamento: {layoutValues.paymentType}</Text>
              <Text>Nota fiscal nº: {layoutValues.invoice.number}</Text>
              <Text>Vencimento: {layoutValues.invoice.due}</Text>
              <Text>Valor: {layoutValues.invoice.value}</Text>
              <Text>NCM:{layoutValues.ncm}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.section, { gap: 2, fontSize: 10 }]}>
          {layoutValues.obs_final && <DocumentSeparator />}
          {layoutValues.obs_final && <Text>Observações:</Text>}

          {layoutValues.obs_final && <Text>{layoutValues.obs_final}</Text>}
        </View>
      </Page>
    </Document>
  )
}
