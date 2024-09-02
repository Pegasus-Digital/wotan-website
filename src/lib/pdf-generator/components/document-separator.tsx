import { StyleSheet, View } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: '1px',
    backgroundColor: 'gray',
    marginVertical: 2,
    opacity: 0.5,
  },
})

export function DocumentSeparator() {
  return <View style={styles.separator} />
}

export function DocumentFiller() {
  return <View style={{ flex: 1 }} />
}
