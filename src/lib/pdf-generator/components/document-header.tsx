import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import Logo from '../wotan.png'

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 10,
    padding: 10,
  },
  logo: {
    width: '100%',
    maxWidth: '240px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export function DocumentHeader() {
  return (
    <>
      <View style={styles.section}>
        <View style={styles.header}>
          <Image src={Logo.src} style={styles.logo} />
          <View>
            <Text>Telefone: (51) 3321-1996</Text>
            <Text>Rua João Guimarães, 301 - Santa Cecília</Text>
            <Text>CEP 90630-170 - Porto Alegre - RS</Text>
            <Text>www.wotanbrindes.com.br</Text>
          </View>
        </View>
      </View>
    </>
  )
}
