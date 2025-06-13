import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { FormItem } from '@/components/ui/form'

export function TitleDescription({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name='title'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormDescription>
              O título principal da seção. (Não é obrigatório, caso não seja
              preenchido, o espaço ficará vazio.)
            </FormDescription>
            <FormControl>
              <input
                {...field}
                className='w-full rounded-md border border-input bg-background px-3 py-2'
                // placeholder='Digite o título do carrossel'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name='description'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormDescription>
              Uma breve descrição da seção. (Não é obrigatório, caso não seja
              preenchido, o espaço ficará vazio.)
            </FormDescription>
            <FormControl>
              <textarea
                {...field}
                className='min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2'
                // placeholder='Digite a descrição do carrossel'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
