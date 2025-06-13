import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TimelineSection } from '@/payload/payload-types'
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
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { TitleDescription } from './parts/title-description'
import { GripVertical, Trash2 } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { toast } from 'sonner'
import { useState, useCallback } from 'react'
import { Icons } from '@/components/icons'

const timelineSectionSchema = z.object({
  blockType: z.literal('timeline-section'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  cards: z.array(z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
  })),
  id: z.string().optional().nullable(),
})

type TimelineSectionFormValues = z.infer<typeof timelineSectionSchema>

interface TimelineSectionFormProps {
  initialData?: TimelineSection
  onSubmit: (data: TimelineSectionFormValues) => void
  isSubmitting?: boolean
}

export function TimelineSectionForm({ initialData, onSubmit, isSubmitting }: TimelineSectionFormProps) {
  const [isDragging, setIsDragging] = useState(false)

  // Format dates in the initial data to YYYY-MM-DD format
  const formattedInitialData = initialData ? {
    ...initialData,
    cards: initialData.cards?.map(card => ({
      ...card,
      date: card.date ? new Date(card.date).toISOString().split('T')[0] : '',
    })) || [],
  } : undefined

  const form = useForm<TimelineSectionFormValues>({
    resolver: zodResolver(timelineSectionSchema),
    mode: 'onChange',
    defaultValues: formattedInitialData || {
      blockType: 'timeline-section',
      invertBackground: false,
      title: '',
      description: '',
      cards: [{
        title: '',
        description: '',
        date: '',
      }],
    },
  })

  const handleSubmit = (data: TimelineSectionFormValues) => {
    try {
      // Ensure all required fields are present
      const validatedData = timelineSectionSchema.parse(data)
      onSubmit(validatedData)
    } catch (error) {
      toast.error('Erro ao salvar. Verifique os campos obrigatórios.')
    }
  }

  const onDragEnd = useCallback(
    (result: any) => {
      setIsDragging(false)
      if (!result.destination) return

      const sourceIndex = result.source.index
      const destinationIndex = result.destination.index

      if (sourceIndex !== destinationIndex) {
        const currentCards = form.getValues('cards')
        const newCards = Array.from(currentCards)
        const [removed] = newCards.splice(sourceIndex, 1)
        newCards.splice(destinationIndex, 0, removed)
        
        form.setValue('cards', newCards, {
          shouldValidate: true,
          shouldDirty: true,
        })
        toast.success('Posição do evento atualizada')
      }
    },
    [form],
  )

  const onDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleAddCard = useCallback(() => {
    const currentCards = form.getValues('cards')
    form.setValue('cards', [
      ...currentCards,
      {
        title: '',
        description: '',
        date: '',
      },
    ], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [form])

  const handleRemoveCard = useCallback((index: number) => {
    const currentCards = form.getValues('cards')
    form.setValue('cards', 
      currentCards.filter((_, i) => i !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    )
    toast.success('Evento removido')
  }, [form])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium">Linha do Tempo</h3>
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
            <FormField
              control={form.control}
              name="cards"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-0.5">
                      <FormLabel>Eventos da Linha do Tempo</FormLabel>
                      <FormDescription>
                        Adicione eventos para a linha do tempo. Atenção: os eventos não são ordenados pela data, sim pela ordem definida aqui.
                      </FormDescription>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddCard}
                      className="h-8 w-8"
                    >
                      <Icons.Add className="h-4 w-4" />
                      <span className="sr-only">Adicionar Evento</span>
                    </Button>
                  </div>
                  <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                    <Droppable droppableId="timeline-cards">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {field.value?.map((card, cardIndex) => (
                            <Draggable
                              key={cardIndex}
                              draggableId={`card-${cardIndex}`}
                              index={cardIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`space-y-4 p-4 border rounded-lg bg-background ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab hover:text-primary"
                                    >
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleRemoveCard(cardIndex)}
                                      className="text-destructive hover:text-destructive/90"
                                      disabled={isDragging}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-[1fr,200px] gap-4">
                                    <FormField
                                      control={form.control}
                                      name={`cards.${cardIndex}.title`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Título</FormLabel>
                                          <FormControl>
                                            <input
                                              {...field}
                                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name={`cards.${cardIndex}.date`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Data</FormLabel>
                                          <FormControl>
                                            <input
                                              type="date"
                                              {...field}
                                              className="w-full rounded-md border border-input bg-background px-3 py-2"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <FormField
                                    control={form.control}
                                    name={`cards.${cardIndex}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Descrição</FormLabel>
                                        <FormControl>
                                          <textarea
                                            {...field}
                                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 