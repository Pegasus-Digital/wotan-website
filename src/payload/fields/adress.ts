import { PatternField } from '@nouance/payload-better-fields-plugin'
import type { Field } from 'payload/types'

export const adress: Field = {
  name: 'adress',
  type: 'group',
  fields: [
    {
      name: 'street',
      type: 'text',
    },
    {
      name: 'number',
      type: 'text',
    },
    {
      name: 'neighborhood',
      type: 'text',
    },
    {
      name: 'city',
      type: 'text',
    },
    {
      name: 'state',
      type: 'select',
      options: [
        { value: 'AC', label: 'Acre' },
        { value: 'AL', label: 'Alagoas' },
        { value: 'AP', label: 'Amapá' },
        { value: 'AM', label: 'Amazonas' },
        { value: 'BA', label: 'Bahia' },
        { value: 'CE', label: 'Ceará' },
        { value: 'DF', label: 'Distrito Federal' },
        { value: 'ES', label: 'Espirito Santo' },
        { value: 'GO', label: 'Goiás' },
        { value: 'MA', label: 'Maranhão' },
        { value: 'MS', label: 'Mato Grosso do Sul' },
        { value: 'MT', label: 'Mato Grosso' },
        { value: 'MG', label: 'Minas Gerais' },
        { value: 'PA', label: 'Pará' },
        { value: 'PB', label: 'Paraíba' },
        { value: 'PR', label: 'Paraná' },
        { value: 'PE', label: 'Pernambuco' },
        { value: 'PI', label: 'Piauí' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'RN', label: 'Rio Grande do Norte' },
        { value: 'RS', label: 'Rio Grande do Sul' },
        { value: 'RO', label: 'Rondônia' },
        { value: 'RR', label: 'Roraima' },
        { value: 'SC', label: 'Santa Catarina' },
        { value: 'SP', label: 'São Paulo' },
        { value: 'SE', label: 'Sergipe' },
        { value: 'TO', label: 'Tocantins' },
      ],
    },
    ...PatternField(
      {
        name: 'cep',
        type: 'text',
        required: false,
        admin: {
          placeholder: '% 20',
        },
      },
      {
        format: '#####-###',
        prefix: '% ',
        allowEmptyFormatting: true,
        mask: '_',
      },
    ),
  ],
}
