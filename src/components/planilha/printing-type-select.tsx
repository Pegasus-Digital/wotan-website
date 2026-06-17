'use client'

import { Control, FieldPath, FieldValues } from 'react-hook-form'

import { usePrintingTypes } from '@/hooks/use-printing-types'
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

type PrintingTypeSelectBaseProps<T extends FieldValues> = {
  control: Control<T>
  name: FieldPath<T>
  disabled?: boolean
  placeholder?: string
  printingTypes?: PrintingTypeOption[]
}

function PrintingTypeSelectField<T extends FieldValues>({
  control,
  name,
  disabled,
  placeholder = 'Selecione...',
  printingTypes,
  showLabel,
}: PrintingTypeSelectBaseProps<T> & { showLabel: boolean }) {
  const fetchedPrintingTypes = usePrintingTypes()
  const resolvedPrintingTypes = printingTypes ?? fetchedPrintingTypes

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const options = resolvePrintingTypeOptions(
          resolvedPrintingTypes,
          field.value as string | null | undefined,
        )

        return (
          <FormItem>
            {showLabel && <FormLabel>Tipo de Impressão</FormLabel>}
            <FormControl>
              <Select
                value={field.value ?? undefined}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
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

type PrintingTypeSelectProps<T extends FieldValues> =
  PrintingTypeSelectBaseProps<T> & {
    printingTypes: PrintingTypeOption[]
  }

export function PrintingTypeSelect<T extends FieldValues>({
  control,
  name,
  printingTypes,
  disabled,
}: PrintingTypeSelectProps<T>) {
  return (
    <PrintingTypeSelectField
      control={control}
      name={name}
      printingTypes={printingTypes}
      disabled={disabled}
      showLabel
    />
  )
}

export function ItemPrintingTypeSelect<T extends FieldValues>({
  control,
  name,
  disabled,
  placeholder = 'Selecione',
}: PrintingTypeSelectBaseProps<T>) {
  return (
    <PrintingTypeSelectField
      control={control}
      name={name}
      disabled={disabled}
      placeholder={placeholder}
      showLabel={false}
    />
  )
}
