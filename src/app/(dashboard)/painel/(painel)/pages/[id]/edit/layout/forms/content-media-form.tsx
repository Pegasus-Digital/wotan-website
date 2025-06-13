import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ContentMedia, Media } from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { RichText } from '@/components/rich-text'
import { TitleDescription } from './parts/title-description'
import { ImageUploader } from '@/app/(dashboard)/sistema/(sistema)/catalogo/produtos/_components/image-uploader'
import { useState, useEffect, useCallback } from 'react'
import { Image } from '@/components/media/image'
import { Icons } from '@/components/icons'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Lead, Small } from '@/components/typography/texts'

const contentMediaSchema = z.object({
  blockType: z.literal('content-media'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  mediaPosition: z.enum(['left', 'right']),
  richText: z.array(z.any()),
  media: z.union([z.string(), z.custom<Media>()]),
  id: z.string().optional().nullable(),
})

type ContentMediaFormValues = z.infer<typeof contentMediaSchema>

interface ContentMediaFormProps {
  initialData?: ContentMedia
  onSubmit: (data: ContentMediaFormValues) => void
  isSubmitting?: boolean
}

export function ContentMediaForm({ initialData, onSubmit, isSubmitting }: ContentMediaFormProps) {
  console.log('ContentMediaForm rendered with initialData:', initialData)
  
  const [media, setMedia] = useState<Media[]>(initialData?.media ? [initialData.media as Media] : [])
  console.log('Initial media state:', media)

  const form = useForm<ContentMediaFormValues>({
    resolver: zodResolver(contentMediaSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      blockType: 'content-media',
      invertBackground: false,
      title: '',
      description: '',
      mediaPosition: 'left',
      richText: [],
      media: '',
    },
  })

  // Log form values whenever they change
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form values changed:', value)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const handleRemoveImage = useCallback(() => {
    console.log('handleRemoveImage called')
    console.log('Current media before removal:', media)
    setMedia([])
    form.setValue('media', '')
    console.log('Media state after removal:', [])
    console.log('Form media value after removal:', form.getValues('media'))
    toast.success('Imagem removida')
  }, [form, media])

  const handleSetMedia = useCallback((newMedia: Media[]) => {
    console.log('handleSetMedia called with:', newMedia)
    console.log('Current media state before update:', media)
    console.log('Current form media value before update:', form.getValues('media'))

    const newImage = newMedia[0]
    if (newImage) {
      console.log('Processing new image:', {
        id: newImage.id,
        filename: newImage.filename,
        url: newImage.url
      })

      // First update the form value
      form.setValue('media', newImage.id, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      })

      // Then update the media state
      setMedia([newImage])

      // Verify the updates
      console.log('Form media value after update:', form.getValues('media'))
      console.log('Media state after update:', [newImage])
      
      // Check if the form state reflects our changes
      const formState = form.getValues()
      console.log('Complete form state after update:', formState)

      toast.success('Imagem adicionada com sucesso')
    } else {
      console.warn('No new image provided to handleSetMedia')
    }
  }, [form])

  // Add a watcher for the media form field
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'media') {
        console.log('Form media field changed:', {
          newValue: value.media,
          currentMediaState: media
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [form, media])

  function handleSubmit(data: ContentMediaFormValues) {
    console.log('Form submitted with data:', data)
    console.log('Current media state at submit:', media)
    console.log('Form media value at submit:', form.getValues('media'))
    
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      console.error('Validation errors:', errors)
      alert('Form has validation errors. Check console for details.')
    } else {
      // Ensure we're sending the correct media value
      const submitData = {
        ...data,
        media: media.length > 0 ? media[0].id : '',
      }
      console.log('Submitting data:', submitData)
      onSubmit(submitData)
    }
  }

  // Log media state changes
  useEffect(() => {
    console.log('Media state changed:', media)
  }, [media])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium">Conteúdo + Mídia</h3>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => {
            console.log('Submit button clicked')
            form.handleSubmit(handleSubmit)()
          }}
          className="min-w-[100px]"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => {
            console.log('Form submit event triggered')
            form.handleSubmit(handleSubmit)(e)
          }} className="space-y-4">
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                <h3 className="font-bold">Form Validation Errors:</h3>
                <ul className="list-disc pl-5">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>
                      {field}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <TitleDescription form={form} />

            <FormField
              control={form.control}
              name="richText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo</FormLabel>
                  <FormDescription>
                    Escreva o conteúdo da seção aqui.
                  </FormDescription>
                  <FormControl>
                    <RichText
                      value={field.value}
                      onChange={(value) => {
                        console.log('RichText changed:', value)
                        field.onChange(value)
                      }}
                      className="min-h-[200px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posição da Mídia</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        console.log('Media position changed:', value)
                        field.onChange(value)
                      }}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="left" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Esquerda
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="right" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Direita
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-6">
              {/* Images Management */}
              {media.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">
                      Imagem Selecionada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 rounded-lg border px-4 py-2">
                      <div className="relative aspect-video h-24 w-40 overflow-hidden rounded-md bg-muted">
                        <Image
                          resource={media[0]}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {media[0].filename}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log('Remove image button clicked')
                          handleRemoveImage()
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Icons.Trash className="h-5 w-5 hover:text-white" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Upload de Imagem</CardTitle>
                  <CardDescription>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <p>
                        Tamanho recomendado: 1920x1080 pixels com proporção 16:9
                      </p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {media.length === 0 ? (
                    <ImageUploader 
                      setMedia={(newMedia) => {
                        console.log('ImageUploader setMedia called with:', newMedia)
                        handleSetMedia(newMedia)
                      }} 
                    />
                  ) : (
                    <div>
                      <div>
                        <label className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6">
                          <div className="text-center">
                            <div className="mx-auto max-w-min rounded-full bg-red-100 p-2">
                              <Icons.Upload className="h-5 w-5" />
                            </div>

                            <Lead className="text-md mt-2 font-semibold">
                              Upload bloqueado: Uma imagem já foi selecionada
                            </Lead>

                            <Small className="text-xs text-gray-500">
                              remova a imagem atual para poder adicionar uma nova
                            </Small>
                          </div>
                        </label>

                        <Input
                          id="dropzone-file"
                          accept="image/png, image/jpeg"
                          type="file"
                          className="hidden"
                          disabled={true}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <FormField
              control={form.control}
              name='invertBackground'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                  <FormLabel>Inverter Cores de Fundo</FormLabel>
                  <FormDescription>
                    Se ativado, o fundo do carrossel será invertido, fazendo com que
                    o texto seja branco e o fundo seja colorido.
                  </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        console.log('Background invert changed:', checked)
                        field.onChange(checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 