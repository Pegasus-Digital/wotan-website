import { Separator } from '@/components/ui/separator'
import { PageCard, PageProps } from '@/components/page-card'
import { Content, ContentHeader } from '@/components/content'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface PagesContentProps {
  pages: PageProps[]
}

export function PagesContent({ pages }: PagesContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Páginas'
    //     description='Visualize as páginas do seu website.'
    //   />

    //   <Separator className='mb-4' />
    <ContentLayout title='Páginas'>
      <div className='grid grid-cols-2 grid-rows-2 gap-4'>
        {pages.map((page) => (
          <PageCard
            key={page.title}
            title={page.title}
            href={page.href}
            image={page.image}
          />
        ))}
      </div>
    </ContentLayout>
  )
}
