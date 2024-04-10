import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { PageCard, PageProps } from '@/components/page-card'

interface PagesContentProps {
  pages: PageProps[]
}

export function PagesContent({ pages }: PagesContentProps) {
  // console.log(pages)
  return (
    <Content>
      <ContentHeader
        title='Páginas'
        description='Visualize as páginas do seu website.'
      />

      <Separator className='mb-4' />

      <div className='grid grid-cols-2 gap-4 desktop:grid-cols-3'>
        {pages.map((page) => (
          <PageCard
            key={page.title}
            title={page.title}
            href={page.href}
            image={page.image}
            updatedAt={page.updatedAt}
          />
        ))}
      </div>
    </Content>
  )
}
