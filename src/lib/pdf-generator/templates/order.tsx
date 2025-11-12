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
import { formatBRL, formatPhoneNumber } from '@/lib/format'

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
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeCell: {
    width: '10%',
  },
  productCell: {
    display: 'flex',
    width: '40%',
  },
  productText: {
    fontSize: 10,
    textAlign: 'justify',
    marginBottom: 2, // Adjust this value to control the space between lines
  },
  quantityCell: {
    width: '20%',
  },
  unitPriceCell: {
    width: '15%',
  },
  totalPriceCell: {
    width: '15%',
  },
})

interface OrderDocumentProps {
  order: Order
}

function calculateTotal(order: Order): number {
  return order.itens.reduce((total, item) => {
    return total + (item.quantity * item.price) / 100
  }, 0)
}

export function OrderDocument({ order }: OrderDocumentProps) {
  const salesperson =
    typeof order.salesperson === 'object' ? order.salesperson : null

  const client = typeof order.client === 'object' ? order.client : null

  const contact = client.contacts.filter(
    (contact) => contact.id === order.contact,
  )

  const totalValue = calculateTotal(order)

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
              fontSize: 12,
              marginVertical: 10,
            }}
          >
            <Text>Pedido n°:{order.incrementalId}</Text>
            <Text>
              Porto Alegre, {getDDMMYYDate(new Date(order.createdAt))}
            </Text>
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
              <View
                style={{
                  flexDirection: 'column',
                  gap: 4,
                  // flex: 1,
                  width: '60%',
                }}
              >
                <Text>Razão Social: {client.razaosocial}</Text>
                <Text>CNPJ: {client.document}</Text>
                <Text>Inscrição Estadual: {client.document}</Text>
                <Text>Contato: {contact[0].name}</Text>
                <Text>Telefone: {formatPhoneNumber(contact[0].phone)}</Text>
                <Text>Email: {contact[0].email}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'column',
                  gap: 4,
                  // flex: 1,
                  width: '40%',
                }}
              >
                <Text>
                  Vendedor:{' '}
                  {salesperson
                    ? salesperson.name
                    : 'Não há vendedor associado.'}
                </Text>
                <Text>Email: {salesperson ? salesperson.email : '-'}</Text>
                <Text>
                  Tipo de pagamento:{' '}
                  {order.paymentType.charAt(0).toUpperCase() +
                    order.paymentType.slice(1)}
                </Text>
                <Text>Condição de pagamento: {order.paymentConditions}</Text>
                {/* <Text>
                  Comissão Agência: {order.agency} {order.commission}%
                </Text> */}
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
                          Cidade: {order.adress.city? order.adress.city : '-'} - {order.adress.state? order.adress.state : '-'}
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
            <View style={styles.codeCell}>
              <Text>Código</Text>
            </View>
            <View style={styles.productCell}>
              <Text>Produto</Text>
            </View>
            <View style={styles.quantityCell}>
              <Text style={{ textAlign: 'right' }}>Quantidade</Text>
            </View>
            <View style={styles.unitPriceCell}>
              <Text style={{ textAlign: 'right' }}>Valor unitário</Text>
            </View>
            <View style={styles.totalPriceCell}>
              <Text style={{ textAlign: 'right' }}>Valor total</Text>
            </View>
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
                  <View style={styles.codeCell}>
                    <Text
                      style={{
                        fontSize: 10,
                      }}
                    >
                      {product.sku}
                    </Text>
                  </View>
                  <View style={styles.productCell}>
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
                          <Text key={attr.id} style={styles.productText}>
                            {attributeType.name}: {attr.name}
                          </Text>
                        )
                      })}
                    <Text style={styles.productText}>
                      Impressão: {item.print}
                    </Text>
                    <Text style={styles.productText}>
                      Amostra: ({item.sample ? 'X' : ' '})
                    </Text>
                    <Text style={styles.productText}>
                      Layout: ({item.layoutSent ? 'X' : ' '}) Enviado (
                      {item.layoutApproved ? 'X' : ' '}) Aprovado
                    </Text>
                  </View>
                  <View style={styles.quantityCell}>
                    <Text style={{ fontSize: 11, textAlign: 'right' }}>
                      {item.quantity}
                    </Text>
                  </View>
                  <View style={styles.unitPriceCell}>
                    <Text style={{ fontSize: 11, textAlign: 'right' }}>
                      {formatBRL(item.price / 100)}
                    </Text>
                  </View>
                  <View style={styles.totalPriceCell}>
                    <Text style={{ fontSize: 11, textAlign: 'right' }}>
                      {formatBRL(item.quantity * (item.price / 100))}
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
            Valor total do pedido: {formatBRL(totalValue)}
          </Text>

          {order.notes && <Text>Observações:</Text>}

          {order.notes && <Text>{order.notes}</Text>}
        </View>
      </Page>
    </Document>
  )
}
