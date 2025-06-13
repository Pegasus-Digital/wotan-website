import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ClientGrid, Media } from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { TitleDescription } from './parts/title-description'
import { ImageUploader } from '@/app/(dashboard)/sistema/(sistema)/catalogo/produtos/_components/image-uploader'
import { Image } from '@/components/media/image'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useState, useCallback, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

const clientGridSchema = z.object({
  blockType: z.literal('client-grid'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional(),
  id: z.string().optional(),
})

type ClientGridFormValues = z.infer<typeof clientGridSchema>

interface ClientGridFormProps {
  initialData?: ClientGrid
  onSubmit: (data: ClientGridFormValues & { clients: {logo:string}[] }) => void
  isSubmitting?: boolean
}

export function ClientGridForm({ initialData, onSubmit, isSubmitting }: ClientGridFormProps) {
  // Transform initial clients data to match the expected format
  const initialClients: Media[] = initialData?.clients?.map(client => {
    if (!client.logo) return null
    if (typeof client.logo === 'string') {
      return { id: client.logo } as Media
    }
    // If it's already a Media object, return it as is
    return client.logo as Media
  }).filter(Boolean) || []

  const [clients, setClients] = useState<Media[]>(initialClients)
  const [isDragging, setIsDragging] = useState(false)

  // Update local state when initialData changes
  useEffect(() => {
    const newInitialClients = initialData?.clients?.map(client => {
      if (!client.logo) return null
      if (typeof client.logo === 'string') {
        return { id: client.logo } as Media
      }
      return client.logo as Media
    }).filter(Boolean) || []
    setClients(newInitialClients)
  }, [initialData])

  const form = useForm<ClientGridFormValues>({
    resolver: zodResolver(clientGridSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      blockType: 'client-grid',
      invertBackground: false,
      title: '',
      description: '',
    },
  })

  const errors = form.formState.errors

  function handleSubmit(data: ClientGridFormValues) {
    const clientsIds = clients.map(client => {
      return { logo: client.id }
    })

    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      alert('Form has validation errors. Check console for details.')
    } else {
      onSubmit({ ...data, clients: clientsIds })
    }
  }

  const handleSetMedia = useCallback((newMedia: Media[]) => {
    setClients(newMedia)
    toast.success('Imagem adicionada com sucesso')
  }, [clients])

  const handleRemoveClient = useCallback(
    (index: number) => {
      setClients(prev => prev.filter((_, i) => i !== index))
      toast.success('Cliente removido com sucesso')
    },
    []
  )

  const onDragEnd = useCallback(
    (result: any) => {
      setIsDragging(false)
      if (!result.destination) return

      const sourceIndex = result.source.index
      const destinationIndex = result.destination.index

      if (sourceIndex !== destinationIndex) {
        const newClients = Array.from(clients)
        const [removed] = newClients.splice(sourceIndex, 1)
        newClients.splice(destinationIndex, 0, removed)
        setClients(newClients)
        toast.success('Posição do cliente atualizada')
      }
    },
    [clients]
  )

  const onDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium">Grade de Imagens</h3>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={form.handleSubmit(handleSubmit)}
          className="min-w-[100px]"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
            {/* <FormField
              control={form.control}
              name="invertBackground"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Inverter Fundo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}
            <TitleDescription form={form} />
            <FormItem>
              <FormLabel>Imagens</FormLabel>
              <div className="space-y-4">
                {clients.length > 0 && (
                  <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                    <Droppable droppableId="clients">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {clients.map((client, clientIndex) => (
                            client && client.id ? (
                              <Draggable
                                key={client.id}
                                draggableId={client.id}
                                index={clientIndex}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                                      snapshot.isDragging
                                        ? 'bg-muted shadow-lg'
                                        : 'hover:bg-muted/50'
                                    }`}
                                  >
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                                      <Image
                                        resource={client}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-muted-foreground">
                                        Cliente {clientIndex + 1}
                                      </p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveClient(clientIndex)}
                                      className="text-destructive hover:text-destructive"
                                      disabled={isDragging}
                                    >
                                      <Icons.Trash className="h-5 w-5" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ) : null
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
                <ImageUploader setMedia={handleSetMedia} />
              </div>
            </FormItem>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 