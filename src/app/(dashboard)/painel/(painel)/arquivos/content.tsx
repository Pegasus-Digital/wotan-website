import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { FilesTable } from './_components/(table)/files-table'

import { getFiles } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface FilesContentProps {
  files: ReturnType<typeof getFiles>
}

export function FilesContent({ files }: FilesContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Arquivos'
    //     description='Gerencie os arquivos do site.'
    //   />
    //   <Separator className='mb-4' />
    <ContentLayout title='Arquivos'>
      <FilesTable filesPromise={files} />
    </ContentLayout>
  )
}
