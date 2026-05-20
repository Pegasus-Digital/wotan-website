import type { Field } from 'payload/types'

export const printingTypesField: Field = {
  name: 'printingTypes',
  type: 'array',
  label: 'Tipos de impressão',
  labels: {
    singular: 'Tipo de impressão',
    plural: 'Tipos de impressão',
  },
  admin: {
    description:
      'Opções exibidas na planilha de produção (formulário e PDF). O campo "value" é o identificador salvo no banco.',
  },
  fields: [
    {
      name: 'value',
      type: 'text',
      label: 'Identificador',
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      label: 'Nome exibido',
      required: true,
    },
  ],
}
