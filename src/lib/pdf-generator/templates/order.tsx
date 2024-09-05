import { getDDMMYYDate } from '../../date'

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

import {
  DocumentFiller,
  DocumentSeparator,
} from '../components/document-separator'
import { DocumentHeader } from '../components/document-header'
import {
  Attribute,
  AttributeType,
  Order,
  Product,
} from '@/payload/payload-types'
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
  table_header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
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
  products_table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  product: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  cell: {
    display: 'flex',
    width: '100%',

    flexGrow: 1,
  },
})

interface OrderDocumentProps {
  order: Order
}

export function OrderDocument({ order }: OrderDocumentProps) {
  const salesperson =
    typeof order.salesperson === 'object' ? order.salesperson : null

  const client = typeof order.client === 'object' ? order.client : null
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <DocumentHeader />
        {/* Order information */}
        <View style={[styles.section, { fontSize: 10 }]}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              fontWeight: 'medium',
              fontSize: 14,
              marginVertical: 10,
            }}
          >
            <Text>Pedido #{order.incrementalId}</Text>
            <Text>Data: {getDDMMYYDate(new Date(order.createdAt))}</Text>
          </View>

          <View
            style={{
              flexDirection: 'column',
              gap: 10,
              fontWeight: 'medium',
            }}
          >
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                marginBottom: 6,
              }}
            >
              <View style={{ flexDirection: 'column', gap: 6, flex: 1 }}>
                <Text>Razão Social: {client.razaosocial}</Text>
                <Text>CNPJ: {client.document}</Text>
                <Text>Inscrição Estadual: 012/3456789</Text>
                <Text>Contato: {order.contact}</Text>
                <Text>Telefone: {order.contact}</Text>
              </View>

              <View style={{ flexDirection: 'column', gap: 6, flex: 1 }}>
                <Text>
                  Vendedor:{' '}
                  {salesperson
                    ? salesperson.name
                    : 'Não há vendedor associado.'}
                </Text>
                <Text>Email: {salesperson ? salesperson.email : '-'}</Text>
                <Text>Tipo de pagamento: {order.paymentType}</Text>
                <Text>Condição de pagamento: {order.paymentConditions}</Text>
                <Text>
                  Comissão Agência: {order.agency} {order.commission}%
                </Text>
              </View>
            </View>
            <DocumentSeparator />

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ gap: 8, flex: 1 }}>
                <View style={{ flexDirection: 'column', gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'medium',
                      marginBottom: 2,
                    }}
                  >
                    Endereço de faturamento:
                  </Text>
                  <View style={{ marginLeft: 10 }}>
                    <Text>
                      Rua: {client.adress.street} nº: {client.adress.number}
                    </Text>
                    <Text>Bairro:{client.adress.neighborhood}</Text>
                    <Text>CEP: {client.adress.cep}</Text>
                    <Text>
                      Cidade: {client.adress.city} - {client.adress.state}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'column', gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'medium',
                      marginBottom: 2,
                    }}
                  >
                    Endereço de entrega:
                  </Text>
                  <View style={{ marginLeft: 10 }}>
                    {order.adress ? (
                      <>
                        <Text>
                          Rua: {order.adress.street} nº: {order.adress.number}
                        </Text>
                        <Text>Bairro: {order.adress.neighborhood}</Text>
                        <Text>CEP: {order.adress.cep}</Text>
                        <Text>
                          Cidade: {order.adress.city} - {order.adress.state}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text>
                          Rua: {client.adress.street} nº: {client.adress.number}
                        </Text>
                        <Text>Bairro:{client.adress.neighborhood}</Text>
                        <Text>CEP: {client.adress.cep}</Text>
                        <Text>
                          Cidade: {client.adress.city} - {client.adress.state}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'column', gap: 4, flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 'medium',
                    marginBottom: 2,
                  }}
                >
                  Detalhes do Transporte:
                </Text>
                <Text>
                  Frete: {order.shippingType === 'cif' ? 'CIF' : 'FOB'}
                </Text>
                <Text>Transportadora: {order.shippingCompany}</Text>
                <Text>Prazo de entrega: {order.shippingTime}</Text>
              </View>
            </View>
            <DocumentSeparator />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.table_header}>
            <Text style={{ textAlign: 'left' }}>Código</Text>
            <Text style={{ textAlign: 'left' }}>Produto</Text>
            <Text style={{ textAlign: 'right' }}>Quantidade</Text>
            <Text style={{ textAlign: 'right' }}>Valor unitário</Text>
            <Text style={{ textAlign: 'right' }}>Valor total</Text>
          </View>
          <DocumentSeparator />
          {/* Product list */}
          <View style={styles.products_table}>
            {order.itens.map((item) => {
              const product = item.product as Product
              const attributes = item.attributes as Attribute[]

              return (
                <View
                  key={item.id}
                  style={[
                    styles.product,
                    {
                      borderBottom: 1,
                      borderColor: 'gray',
                      marginTop: 4,
                      marginBottom: 8,
                    },
                  ]}
                >
                  <View style={styles.cell}>
                    <Text
                      style={{
                        fontSize: 10,
                      }}
                    >
                      {product.sku}
                    </Text>
                  </View>
                  <View style={styles.cell}>
                    <Text
                      style={{
                        fontSize: 11,
                        textAlign: 'justify',
                        marginBottom: 4,
                      }}
                    >
                      {product.title}
                    </Text>
                    {attributes &&
                      attributes.map((attr) => {
                        const attributeType = attr.type as AttributeType
                        return (
                          <Text
                            key={attr.id}
                            style={{ fontSize: 10, textAlign: 'justify' }}
                          >
                            {attributeType.name}: {attr.name}
                          </Text>
                        )
                      })}
                    <Text style={{ fontSize: 10, textAlign: 'justify' }}>
                      Impressão: {item.print}
                    </Text>
                    <Text style={{ fontSize: 10, textAlign: 'justify' }}>
                      Amostra: ({item.sample ? 'X' : ' '})
                    </Text>
                    <Text style={{ fontSize: 10, textAlign: 'justify' }}>
                      Layout: ({item.layoutSent ? 'X' : ' '}) Enviado (
                      {item.layoutApproved ? 'X' : ' '}) Aprovado
                    </Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={{ fontSize: 11, textAlign: 'right' }}>
                      {item.quantity}
                    </Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={{ fontSize: 11, textAlign: 'right' }}>
                      {formatBRL(125)}
                    </Text>
                  </View>
                  <View style={styles.cell}>
                    <Text style={{ fontSize: 11, textAlign: 'right' }}>
                      {formatBRL(item.quantity * 125)}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        <DocumentSeparator />
        {/* Footer - total + details */}
        <View style={[styles.section, { gap: 2, fontSize: 10 }]}>
          <Text style={{ alignSelf: 'flex-end' }}>
            Valor total do pedido: R$ 12.345,67
          </Text>

          {order.notes && <Text>Observações:</Text>}

          {order.notes && <Text>{order.notes}</Text>}
        </View>
      </Page>
    </Document>
  )
}
