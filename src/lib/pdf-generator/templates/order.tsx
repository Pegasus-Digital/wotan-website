import { getDDMMYYDate } from '../../date'

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

import {
  DocumentFiller,
  DocumentSeparator,
} from '../components/document-separator'
import { DocumentHeader } from '../components/document-header'

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

interface OrderDocumentProps {}

export function OrderDocument({}: OrderDocumentProps) {
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
            <Text>Pedido nº: 12345</Text>
            <Text>Data: {getDDMMYYDate(new Date())}</Text>
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
                <Text>Razão Social: Blablá Indústria Automotiva LTDA</Text>
                <Text>CNPJ: 01.234.567/0001-89</Text>
                <Text>Inscrição Estadual: 012/3456789</Text>
                <Text>Contato: Daniel</Text>
                <Text>Telefone: (51) 98765-4321</Text>
              </View>

              <View style={{ flexDirection: 'column', gap: 2, flex: 1 }}>
                <Text>Vendedor: Daniel</Text>
                <Text>Email: daniel@wotanbrindes.com.br</Text>
                <Text>Tipo de pagamento: Boleto</Text>
                <Text>
                  Condição de pagamento: 35% pedido + 15 / 30 / 45 dias
                </Text>
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

          <Text>Observações:</Text>

          <Text>
            EMPRESA OPTANTE PELO SIMPLES NACIONAL NÃO GERA DIREITO A CREDITO
            FISCAL DE ICMS, DE ISS E DE IPI.
          </Text>
        </View>
      </Page>
    </Document>
  )
}
