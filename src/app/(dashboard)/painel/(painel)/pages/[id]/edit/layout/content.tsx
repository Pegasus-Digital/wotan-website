'use client'

import { toast } from 'sonner'
import { Icons } from '@/components/icons'
import { useRouter } from 'next/navigation'
import { Page } from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { updatePage } from '@/app/(dashboard)/painel/(painel)/pages/_logic/actions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductCarouselForm } from './forms/product-carousel-form'
import { FeaturedSectionForm } from './forms/featured-section-form'
import { StatisticSectionForm } from './forms/statistic-section-form'
import { ContentSectionForm } from './forms/content-section-form'
import { ClientGridForm } from './forms/client-grid-form'
import { ContentMediaForm } from './forms/content-media-form'
import { FAQForm } from './forms/faq-form'
import { ThreeColumnsForm } from './forms/three-columns-form'
import { TimelineSectionForm } from './forms/timeline-section-form'
import { useState } from 'react'
import { valueIsValueWithRelation } from 'payload/types'

interface EditLayoutContentProps {
  pageId: string
  initialData: Page['layout']
}

const BLOCK_TYPES = [
  { label: 'Carrossel de Produtos', value: 'product-carousel' },
  { label: 'Em Destaque', value: 'featured-section' },
  { label: ' Estatísticas', value: 'statistic-section' },
  { label: 'Conteúdo', value: 'content-section' },
  { label: 'Grid de Clientes', value: 'client-grid' },
  { label: 'Conteúdo + Mídia', value: 'content-media' },
  { label: 'FAQ', value: 'faq-section' },
  { label: 'Três Colunas', value: 'three-columns' },
  { label: 'Linha do Tempo', value: 'timeline-section' },
] as const

const cleanBlockData = (block: any) => {
  const cleanedBlock = { ...block }

  //lets not remove the id of the block itself

  // Handle ProductCarousel
  if (block.blockType === 'product-carousel') {
    if (block.categories) {
      cleanedBlock.categories = block.categories.map((cat: any) => 
        typeof cat === 'string' ? cat : cat.id
      )
    }
    if (block.selectedDocs) {
      cleanedBlock.selectedDocs = block.selectedDocs.map((doc: any) => ({
        ...doc,
        value: typeof doc.value === 'string' ? doc.value : doc.value.id
      }))
    }
    if (block.populatedDocs) {
      cleanedBlock.populatedDocs = block.populatedDocs.map((doc: any) => ({
        ...doc,
        value: typeof doc.value === 'string' ? doc.value : doc.value.id
      }))
    }
    if (block.seeMoreLink?.reference) {
      cleanedBlock.seeMoreLink = {
        ...block.seeMoreLink,
        reference: {
          ...block.seeMoreLink.reference,
          value: typeof block.seeMoreLink.reference.value === 'string' 
            ? block.seeMoreLink.reference.value 
            : block.seeMoreLink.reference.value.id
        }
      }
    }
  }

  // Handle FeaturedSection
  if (block.blockType === 'featured-section') {
    if (block.cards) {
      cleanedBlock.cards = block.cards.map((card: any) => ({
        ...card,
        image: typeof card.image === 'string' ? card.image : card.image.id,
        linkTo: {
          ...card.linkTo,
          value: typeof card.linkTo.value === 'string' ? card.linkTo.value : card.linkTo.value.id
        }
      }))
    }
  }

    // Handle StatisticSection
    if (block.blockType === 'statistic-section') {
        // No relations to clean in this block type
        if (block.statistics) {
            cleanedBlock.statistics = block.statistics.map((stat: any) => {
                const { id, ...rest } = stat
                return rest
            })
        }
    }

  // Handle ContentSection
  if (block.blockType === 'content-section') {
    // No relations to clean in this block type
  }

  // Handle ClientGrid
  if (block.blockType === 'client-grid') {
    if (block.clients) {
      cleanedBlock.clients = block.clients.map((client: any) => ({
        ...client,
        logo: typeof client.logo === 'string' ? client.logo : client.logo.id
      }))
    }
  }

  // Handle ContentMedia
  if (block.blockType === 'content-media') {
    if (block.media) {
      cleanedBlock.media = typeof block.media === 'string' ? block.media : block.media.id
    }
  }

  // Handle FAQ
  if (block.blockType === 'faq-section') {
    // No relations to clean in this block type
  }

  // Handle ThreeColumns
  if (block.blockType === 'three-columns') {
    // No relations to clean in this block type
  }

  // Handle TimelineSection
  if (block.blockType === 'timeline-section') {
    // No relations to clean in this block type
  }

  // Clean common fields that might exist in any block
  if (block.meta?.image) {
    cleanedBlock.meta = {
      ...block.meta,
      image: typeof block.meta.image === 'string' ? block.meta.image : block.meta.image.id
    }
  }
//   console.log('cleanedBlock', cleanedBlock)

  //make sure the block has a id
  if (!cleanedBlock.id) {
    console.log('messed up block', block) 
    cleanedBlock.id = block.id
  }

  //make sure the block has a blockType

  return cleanedBlock
}

export function EditLayoutContent({ pageId, initialData }: EditLayoutContentProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (blockData: any) => {
    try {
      setIsSubmitting(true)
      
      // Ensure we have valid data
      if (!blockData || !blockData.id || !blockData.blockType) {
        // show whats wrong on the console and why it entered here
        console.log('Invalid block data', blockData)
        throw new Error('Invalid block data')
      }

      // Find the index of the block to update
      const blockIndex = initialData.findIndex(block => block.id === blockData.id)
      
      if (blockIndex === -1) {
        throw new Error('Block not found')
      }

      // Create a new array with the updated block
      const updatedLayout = [...initialData]
      updatedLayout[blockIndex] = {
        ...initialData[blockIndex], // Preserve any existing properties
        ...blockData, // Override with new data
        id: blockData.id, // Ensure ID is preserved
        blockType: blockData.blockType, // Ensure blockType is preserved
      }

      // Clean up all blocks in the layout before updating
      const cleanedLayout = updatedLayout.map(block => cleanBlockData(block))

      console.log('Block update:', {
        original: initialData[blockIndex],
        updated: cleanedLayout[blockIndex],
        changes: blockData
      })

      await updatePage(pageId, { layout: cleanedLayout });
      toast.success('Seção atualizada com sucesso!');
      router.refresh()
    } catch (error) {
      console.error('Error updating block:', error)
      toast.error('Erro ao atualizar Seção. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ContentLayout title="Editar Layout">
      <Tabs defaultValue='0'>
        <TabsList>
          {initialData.map((block, index) => {
            const totalBlockTypeCount = initialData
              .filter(b => b.blockType === block.blockType)
              .length;
            const currentBlockIndex = initialData
              .slice(0, index + 1)
              .filter(b => b.blockType === block.blockType)
              .length;
            const blockLabel = BLOCK_TYPES.find(type => type.value === block.blockType)?.label;
            return (
              <TabsTrigger key={block.id} value={index.toString()}>
                {totalBlockTypeCount > 1 ? `${blockLabel} ${currentBlockIndex}` : blockLabel}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {initialData.map((block, index) => {
          const cleanedBlock = cleanBlockData(block)
          return (
            <TabsContent key={block.id} value={index.toString()}>
              {block.blockType === 'product-carousel' && (
                <ProductCarouselForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'featured-section' && (
                <FeaturedSectionForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'statistic-section' && (
                <StatisticSectionForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'content-section' && (
                <ContentSectionForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'client-grid' && (
                <ClientGridForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'content-media' && (
                <ContentMediaForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'faq-section' && (
                <FAQForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'three-columns' && (
                <ThreeColumnsForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
              {block.blockType === 'timeline-section' && (
                <TimelineSectionForm 
                  initialData={cleanedBlock} 
                  onSubmit={onSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </ContentLayout>
  )
} 