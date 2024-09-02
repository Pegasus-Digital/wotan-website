import { formatBRL } from '../../format'
import { getDDMMYYDate } from '../../date'

import {
  Media,
  Budget,
  Product,
  Attribute,
  AttributeType,
} from '@/payload/payload-types'

import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from '@react-pdf/renderer'

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
  information: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  client_information: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  salesperson_information: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  table_header: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
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

interface BudgetDocumentProps {
  budget: Budget
}

export function BudgetDocument({ budget }: BudgetDocumentProps) {
  const salesperson =
    typeof budget.salesperson === 'object' ? budget.salesperson : null

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <DocumentHeader />

        <View style={styles.section}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Text>Orçamento nº: {budget.incrementalId}</Text>
            <Text>
              Última atualização: {getDDMMYYDate(new Date(budget.updatedAt))}
            </Text>
          </View>

          <View style={styles.information}>
            <View style={styles.client_information}>
              <Text>Empresa: {budget.contact.companyName}</Text>
              <Text>Contato: {budget.contact.customerName}</Text>
              <Text>Telefone: {budget.contact.phone}</Text>
              <Text>Email: {budget.contact.email}</Text>
            </View>

            <View style={styles.salesperson_information}>
              <Text>
                Vendedor:{' '}
                {salesperson ? salesperson.name : 'Não há vendedor associado.'}
              </Text>
              <Text>Email: {salesperson ? salesperson.email : '-'}</Text>
              {/* TODO: Definir o que é essa classe */}
              <Text>Classe: (?)</Text>
            </View>
          </View>
        </View>

        {/* Tabela de produtos no orçamento */}
        <View style={styles.section}>
          <View style={styles.table_header}>
            <Text>Imagem</Text>
            <Text>Código</Text>
            <Text>Descrição</Text>
            <Text>Quantidade</Text>
            <Text>Valor unitário</Text>
          </View>

          <DocumentSeparator />

          <View style={styles.products_table}>
            {budget.items.map((item) => {
              const product = item.product as Product
              let featuredImageSrc = (product.featuredImage as Media).url
              const attributes = item.attributes as Attribute[]

              return (
                <View
                  key={item.id}
                  style={[
                    styles.product,
                    { borderBottom: 1, borderColor: 'gray' },
                  ]}
                >
                  <View style={styles.cell}>
                    <Image
                      src={featuredImageSrc}
                      style={{ maxWidth: '80%', maxHeight: 100 }}
                    />
                  </View>
                  <View style={styles.cell}>
                    <Text>{product.sku}</Text>
                  </View>
                  <View style={styles.cell}>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: 'justify',
                        marginBottom: 4,
                      }}
                    >
                      {product.title}
                    </Text>
                    {attributes.map((attr) => {
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
                  </View>
                  <View style={styles.cell}>
                    <Text style={{ textAlign: 'center' }}>{item.quantity}</Text>
                  </View>
                  <View style={styles.cell}>
                    {/* TODO: Definir como o valor unitário vai ser definido para o orçamento. */}
                    <Text style={{ textAlign: 'right' }}>{formatBRL(120)}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        <DocumentFiller />

        <View style={[styles.section, { marginBottom: 10 }]}>
          <Text>Observações:</Text>
          <Text style={{ fontSize: 10, marginTop: 4 }}>
            {budget.conditions}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
