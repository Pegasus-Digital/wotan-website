import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FAQ } from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
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

const faqSchema = z.object({
  blockType: z.literal('faq-section'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional(),
  questions: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
  id: z.string().optional(),
})

type FAQFormValues = z.infer<typeof faqSchema>

interface FAQFormProps {
  initialData?: FAQ
  onSubmit: (data: FAQFormValues) => void
  isSubmitting?: boolean
}

export function FAQForm({ initialData, onSubmit, isSubmitting }: FAQFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [questions, setQuestions] = useState<FAQFormValues['questions']>(
    initialData?.questions || [{
      question: '',
      answer: '',
    }]
  )

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    mode: 'onChange',
    defaultValues: {
      blockType: 'faq-section',
      invertBackground: initialData?.invertBackground || false,
      title: initialData?.title || '',
      description: initialData?.description || '',
      questions: initialData?.questions || [{
        question: '',
        answer: '',
      }],
      id: initialData?.id,
    },
  })

  // Sync form questions with local state
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.questions) {
        setQuestions(value.questions)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Initialize questions from initialData
  useEffect(() => {
    if (initialData?.questions) {
      setQuestions(initialData.questions)
    }
  }, [initialData])

  const onDragEnd = useCallback(
    (result: any) => {
      setIsDragging(false)
      if (!result.destination) return

      const sourceIndex = result.source.index
      const destinationIndex = result.destination.index

      if (sourceIndex !== destinationIndex) {
        const newQuestions = Array.from(questions)
        const [removed] = newQuestions.splice(sourceIndex, 1)
        newQuestions.splice(destinationIndex, 0, removed)
        
        form.setValue('questions', newQuestions, {
          shouldValidate: true,
          shouldDirty: true,
        })
        toast.success('Posição da pergunta atualizada')
      }
    },
    [form, questions],
  )

  const onDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleRemoveQuestion = useCallback((index: number) => {
    if (questions.length <= 1) {
      toast.error('É necessário ter pelo menos uma pergunta')
      return
    }
    
    const newQuestions = questions.filter((_, i) => i !== index)
    form.setValue('questions', newQuestions, {
      shouldValidate: true,
      shouldDirty: true,
    })
    toast.success('Pergunta removida')
  }, [form, questions])

  const handleAddQuestion = useCallback(() => {
    const newQuestions = [
      ...questions,
      {
        question: '',
        answer: '',
      },
    ]
    form.setValue('questions', newQuestions, {
      shouldValidate: true,
      shouldDirty: true,
    })
    toast.success('Nova pergunta adicionada')
  }, [form, questions])

  function handleSubmit(data: FAQFormValues) {
    try {
      const validatedData = faqSchema.parse(data)
      onSubmit(validatedData)
    } catch (error) {
      toast.error('Erro ao salvar. Verifique os campos obrigatórios.')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium">FAQ</h3>
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
              name="questions"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-6">
                    <FormLabel className="text-base font-medium">Perguntas e Respostas</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleAddQuestion}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                    <Droppable droppableId="faq-questions">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-6"
                        >
                          {questions.map((qa, qaIndex) => (
                            <Draggable
                              key={`question-${qaIndex}`}
                              draggableId={`question-${qaIndex}`}
                              index={qaIndex}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-card rounded-lg border shadow-sm transition-all duration-200 ${
                                    snapshot.isDragging 
                                      ? 'shadow-lg ring-2 ring-primary/20' 
                                      : 'hover:border-muted-foreground/20'
                                  }`}
                                >
                                  <div className="flex items-start gap-4 p-6">
                                    <div 
                                      {...provided.dragHandleProps} 
                                      className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
                                    >
                                      <GripVertical className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 space-y-6">
                                      <FormField
                                        control={form.control}
                                        name={`questions.${qaIndex}.question`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-sm font-medium">Pergunta</FormLabel>
                                            <FormControl>
                                              <input
                                                {...field}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary transition-colors"
                                                placeholder="Digite a pergunta"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name={`questions.${qaIndex}.answer`}
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel className="text-sm font-medium">Resposta</FormLabel>
                                            <FormControl>
                                              <textarea
                                                {...field}
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary transition-colors min-h-[100px] resize-y"
                                                placeholder="Digite a resposta"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="mt-2 h-8 w-8 hover:bg-destructive/10"
                                      onClick={() => handleRemoveQuestion(qaIndex)}
                                      disabled={isDragging}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
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