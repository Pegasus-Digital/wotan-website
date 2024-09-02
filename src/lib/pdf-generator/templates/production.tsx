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

interface ProductionDocumentProps {}

export function ProductionDocument({}: ProductionDocumentProps) {
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
            <Text>Pedido nº: 9009</Text>
            <Text>Data: {getDDMMYYDate(new Date())}</Text>
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
                Produto: SKU-12345 Caneta
              </Text>
              <Text>Quantidade: 5000</Text>
              <Text>Atributos:</Text>
              <View style={{ marginLeft: 10 }}>
                <Text>Cor: PRETO</Text>
                <Text>Especificações: METÁLICO</Text>
              </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Text style={{ fontWeight: 'medium', fontSize: 12 }}>
                Razão social: Blabla Indústria LTDA
              </Text>
              <Text>CNPJ: 01.234.567/0001-89</Text>
              <Text>Contato: Daniel</Text>
              <Text>Condição de pagamento: 35% pedido + 15 / 30 / 45 dias</Text>
              <Text>Prazo de entrega: 31/08/2024</Text>
            </View>
          </View>
        </View>

        <DocumentSeparator />

        {/* Detalhes do produto */}
        <View>
          {/* Custos */}
          <View></View>
          {/* Frete */}
          <View></View>

          {/* True/False */}
          <View></View>
        </View>

        <DocumentFiller />
        <DocumentSeparator />

        <View style={styles.section}>
          <View style={styles.footer}>
            <View style={styles.footer_column}>
              <Text>Valor unitário: R$ 3,35</Text>
              <Text>Custo adicional: R$ 3,35</Text>
              <Text>Valor da venda: R$ 3,35</Text>
              <Text>Custo de produção: R$ 3,35</Text>
              <Text>Resultado: R$ 3,35</Text>
            </View>
            <View style={styles.footer_column}>
              <Text>Frete: CIF</Text>
              <Text>Valor do frete: R$ 0,00</Text>
              <Text>Transportadora: Wotan</Text>
              <Text>Prazo de entrega:</Text>
              <Text>Cotação:</Text>
              <Text>Volumes:</Text>
            </View>
            <View style={styles.footer_column}>
              <Text>Data remessa:</Text>
              <Text>Tipo de pagamento: Boleto</Text>
              <Text>Nota fiscal nº:</Text>
              <Text>Vencimento:</Text>
              <Text>Valor: R$ 0,00</Text>
              <Text>NCM:</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
