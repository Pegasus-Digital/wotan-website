'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  PrintingTypeOption,
  resolvePrintingTypeOptions,
} from '@/lib/printing-types'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type PrintingTypeSelectProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  printingTypes: PrintingTypeOption[]
  disabled?: boolean
}

export function PrintingTypeSelect<T extends FieldValues>({
  control,
  name,
  printingTypes,
  disabled,
}: PrintingTypeSelectProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const options = resolvePrintingTypeOptions(
          printingTypes,
          field.value as string | null | undefined,
        )

        return (
          <FormItem>
            <FormLabel>Tipo de Impressão</FormLabel>
            <FormControl>
              <Select
                value={field.value ?? undefined}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione...' />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
