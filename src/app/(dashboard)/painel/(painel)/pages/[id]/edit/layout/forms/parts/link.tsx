import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export function Link({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name='seeMore'
        render={({ field }) => (
          <FormItem className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <FormLabel>Ver mais</FormLabel>
              <FormDescription>
                Adiciona um botão "Ver mais" ao final da seção.
              </FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <Separator />
      <FormField
        control={form.control}
        name='seeMoreLink'
        render={({ field }) => (
          <FormItem
            className={`transition-opacity duration-200 ${!form.watch('seeMore') ? 'opacity-50' : ''}`}
          >
            <div className='space-y-0.5'>
              <FormLabel>Link "Ver mais"</FormLabel>
              <FormDescription>
                Configure o comportamento do botão "Ver mais"
              </FormDescription>
            </div>
            <div className='mt-4 space-y-4'>
              <FormField
                control={form.control}
                name='seeMoreLink.type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Link</FormLabel>
                    <FormDescription>
                      Escolha se o link apontará para uma página existente ou
                      uma URL personalizada.
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex gap-4'
                        disabled={!form.watch('seeMore')||true}
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='reference' id='reference' />
                          <Label htmlFor='reference'>Referência</Label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='custom' id='custom' />
                          <Label htmlFor='custom'>Personalizado</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='seeMoreLink.label'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do link</FormLabel>
                    <FormDescription>
                      O texto que será exibido no botão "Ver mais"
                    </FormDescription>
                    <FormControl>
                      <input
                        {...field}
                        className='w-full rounded-md border border-input bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50'
                        disabled={!form.watch('seeMore')}
                        placeholder='Digite o texto do botão'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch('seeMoreLink.type') === 'reference' && (
                <FormField
                  control={form.control}
                  name='seeMoreLink.reference'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referência</FormLabel>
                      <FormDescription>
                        Selecione a página, produto ou categoria de referência
                      </FormDescription>
                      <FormControl>
                        <select
                          {...field}
                          className='w-full rounded-md border border-input bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50'
                          disabled={true}
                        >
                          <option value="">Selecionar</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch('seeMoreLink.type') === 'custom' && (
                <FormField
                  control={form.control}
                  name='seeMoreLink.url'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormDescription>
                        Digite a URL personalizada para o link
                      </FormDescription>
                      <FormControl>
                        <input
                          {...field}
                          className='w-full rounded-md border border-input bg-background px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50'
                          disabled={!form.watch('seeMore')}
                          placeholder='Digite a URL'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
                            <FormField
                control={form.control}
                name='seeMoreLink.newTab'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel>Abrir em nova aba</FormLabel>
                      <FormDescription>
                        Se ativado, força o navegador a abrir o link em uma nova
                        aba.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!form.watch('seeMore')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </FormItem>
        )}
      />
    </>
  )
}
