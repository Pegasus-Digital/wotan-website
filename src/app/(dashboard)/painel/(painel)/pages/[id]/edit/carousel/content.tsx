'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GripVertical, AlertCircle } from 'lucide-react'
import { ImageUploader } from '@/app/(dashboard)/sistema/(sistema)/catalogo/produtos/_components/image-uploader'
import { Media } from '@/payload/payload-types'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { toast } from 'sonner'
import { Image } from '@/components/media/image'
import { Icons } from '@/components/icons'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { updatePage } from '../../../_logic/actions'
import { useRouter } from 'next/navigation'
import { Small } from '@/components/typography/texts'
import { Input } from '@/components/ui/input'
import { Lead } from '@/components/typography/texts'

const RECOMMENDED_DIMENSIONS = {
  width: 1920,
  height: 480,
  contentWidth: 1280,
  contentHeight: 480,
}

interface CarouselEditorProps {
  initialImages?: Media[]
  onImagesChange?: (images: Media[]) => void
}

function CarouselEditor({
  initialImages = [],
  onImagesChange,
}: CarouselEditorProps) {
  const [images, setMedia] = useState<Media[]>(initialImages)
  const [isDragging, setIsDragging] = useState(false)

  // Update parent when images change
  useEffect(() => {
    onImagesChange?.(images)
  }, [images, onImagesChange])

  const onDragEnd = useCallback(
    (result: any) => {
      setIsDragging(false)
      if (!result.destination) return

      const sourceIndex = result.source.index
      const destinationIndex = result.destination.index

      if (sourceIndex !== destinationIndex) {
        const newImages = Array.from(images)
        const [removed] = newImages.splice(sourceIndex, 1)
        newImages.splice(destinationIndex, 0, removed)
        setMedia(newImages)
        toast.success('Posição da imagem atualizada')
      }
    },
    [images],
  )

  const onDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index)
      setMedia(newImages)
      toast.success('Imagem removida do carrossel')
    },
    [images],
  )

  const handleSetMedia = useCallback(
    (newMedia: Media[]) => {
      if (images.length >= 3) {
        toast.error('Máximo de 3 imagens permitidas no carrossel')
        return
      }
      setMedia(newMedia)
    },
    [images.length],
  )

  return (
    <div className='w-full space-y-6'>
      {/* Images Management */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='text-md'>
              Imagens ({images.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
              <Droppable droppableId='carousel'>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='space-y-4'
                  >
                    {images.map((image, index) => (
                      <Draggable
                        key={image.id}
                        draggableId={image.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-4 rounded-lg border px-4 py-2 transition-colors ${
                              snapshot.isDragging
                                ? 'bg-muted shadow-lg'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className='h-5 w-5 text-muted-foreground' />
                            </div>

                            <div className='relative aspect-[1280/480] h-16 overflow-hidden rounded-md bg-muted'>
                              <Image
                                resource={image}
                                fill
                                className='object-cover'
                              />
                            </div>

                            <div className='min-w-0 flex-1'>
                              <p className='truncate font-medium'>
                                {image.filename}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                Posição: {index + 1}
                              </p>
                            </div>

                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleRemoveImage(index)}
                              className='text-destructive hover:text-destructive'
                              disabled={isDragging}
                            >
                              <Icons.Trash className='h-5 w-5 hover:text-white' />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className='text-md'>Upload de Imagens</CardTitle>
          <CardDescription>
            <div className='flex items-start gap-2 text-sm text-muted-foreground'>
              <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
              <p>
                Tamanho recomendado: {RECOMMENDED_DIMENSIONS.width}x
                {RECOMMENDED_DIMENSIONS.height} pixels com o conteúdo
                centralizado em {RECOMMENDED_DIMENSIONS.contentWidth}x
                {RECOMMENDED_DIMENSIONS.contentHeight} pixels
              </p>
            </div>
            {/* {images.length >= 3 && (
              <div className='mt-2 flex items-start gap-2 text-sm text-destructive'>
                <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
                <p>
                  Upload bloqueado: Máximo de 3 imagens permitidas no carrossel
                </p>
              </div>
            )} */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length < 3 ? (
            <ImageUploader setMedia={handleSetMedia} />
          ) : (
            <div>
              <div>
                <label className='relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6'>
                  <div className='text-center'>
                    <div className='mx-auto max-w-min rounded-full bg-red-100 p-2'>
                      <Icons.Upload className='h-5 w-5' />
                    </div>

                    <Lead className='text-md mt-2 font-semibold'>
                      Upload bloqueado: Máximo de 3 imagens permitidas no
                      carrossel{' '}
                    </Lead>

                    <Small className='text-xs text-gray-500'>
                      remova uma imagem para poder adicionar uma nova
                    </Small>
                  </div>
                </label>

                <Input
                  // {...getInputProps()}
                  id='dropzone-file'
                  accept='image/png, image/jpeg'
                  type='file'
                  className='hidden'
                  disabled={images.length >= 3}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface EditCarouselContentProps {
  pageId: string
  initialImages: Media[]
}

export function EditCarouselContent({
  pageId,
  initialImages,
}: EditCarouselContentProps) {
  const [images, setImages] = useState<Media[]>(initialImages)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleImagesChange = (newImages: Media[]) => {
    setImages(newImages)
  }

  const handleSave = async () => {
    try {
      setIsSubmitting(true)
      await updatePage(pageId, {
        carousel: images.map((image) => ({
          image: image.id,
        })),
      })
      toast.success('Carrossel atualizado com sucesso!')
      router.refresh()
    } catch (error) {
      toast.error('Erro ao atualizar carrossel')
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <ContentLayout
      title='Editar Carrossel'
      navbarButtons={
        <Button
          type='submit'
          disabled={images.length === 0 || isSubmitting}
          onClick={handleSave}
          variant='default'
        >
          <Icons.Save className='mr-2 h-5 w-5' /> Salvar
        </Button>
      }
    >
      <CarouselEditor
        initialImages={images}
        onImagesChange={handleImagesChange}
      />
    </ContentLayout>
  )
}
