import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'
import { FilesTable } from './_components/(table)/files-table'
import { getFiles } from './_logic/queries'

interface FilesContentProps {
  files: ReturnType<typeof getFiles>
}

export function FilesContent({ files }: FilesContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Arquivos'
        description='Gerencie os arquivos do site.'
      />
      <Separator className='mb-4' />

      <FilesTable filesPromise={files} />
    </Content>
  )
}
