import { format, formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function getRelativeDate(date: Date) {
  return formatRelative(date, new Date(), { locale: ptBR })
}

export function getDDMMYYDate(date: Date) {
  return format(date, 'dd/MM/yy', { locale: ptBR })
}
