import { getDDMMYYDate } from '../../date'

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

import {
  DocumentFiller,
  DocumentSeparator,
} from '../components/document-separator'
import { DocumentHeader } from '../components/document-header'
import { Order } from '@/payload/payload-types'

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
              fontSize: 16,
              marginVertical: 10,
            }}
          >
            <Text>Pedido nº: {order.incrementalId}</Text>
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
              style={{ justifyContent: 'space-between', flexDirection: 'row' }}
            >
              <View style={{ flexDirection: 'column', gap: 2, flex: 1 }}>
                <Text>Razão Social: {client.razaosocial}</Text>
                <Text>CNPJ: {client.document}</Text>
                <Text>Inscrição Estadual: 012/3456789</Text>
                <Text>Contato: {order.contact}</Text>
                <Text>Telefone: {order.contact}</Text>
              </View>

              <View style={{ flexDirection: 'column', gap: 2, flex: 1 }}>
                <Text>
                  Vendedor:{' '}
                  {salesperson
                    ? salesperson.name
                    : 'Não há vendedor associado.'}
                </Text>
                <Text>Email: {salesperson ? salesperson.email : '-'}</Text>
                <Text>Tipo de pagamento: {order.paymentType}</Text>
                <Text>Condição de pagamento: {order.paymentConditions}</Text>
                <Text>Comissão Agência: Daniel (interno). 10%</Text>
              </View>
            </View>

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ gap: 4, flex: 1 }}>
                <View style={{ flexDirection: 'column', gap: 2 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'medium' }}>
                    Endereço de faturamento:
                  </Text>
                  <View style={{ marginLeft: 10 }}>
                    <Text>Rua: Rua João Guimarães nº: 301</Text>
                    <Text>Bairro: Santa Cecília</Text>
                    <Text>CEP: 98765-432</Text>
                    <Text>Cidade: Porto Alegre</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'column', gap: 2 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'medium' }}>
                    Endereço de entrega:
                  </Text>
                  <View style={{ marginLeft: 10 }}>
                    <Text>Rua: Rua João Guimarães nº: 301</Text>
                    <Text>Bairro: Santa Cecília</Text>
                    <Text>CEP: 98765-432</Text>
                    <Text>Cidade: Porto Alegre</Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'column', gap: 2, flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: 'medium' }}>
                  Detalhes da entrega:
                </Text>
                <Text>Frete: Sedex</Text>
                <Text>Transportadora: Wotan</Text>
                <Text>Prazo de entrega: 31/08/2024</Text>
              </View>
            </View>
          </View>
        </View>
        <DocumentSeparator />
        {/* Product list */}
        <View style={styles.section}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Text style={{ height: 40 }}>Product #1</Text>
            <Text style={{ height: 40 }}>Product #2</Text>
            <Text style={{ height: 40 }}>Product #3</Text>
            <Text style={{ height: 40 }}>Product #4</Text>
            <Text style={{ height: 40 }}>Product #5</Text>
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
