'use client'

import Link from 'next/link'
import Image, { StaticImageData } from 'next/image'
import { Delete, Edit, Eye, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InlineCode, Large, Lead, Small } from '@/components/typography/texts'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface PageProps {
  title: string
  href: string
  updatedAt: string
  image: StaticImageData
}

export function PageCard({ title, href, image, updatedAt }: PageProps) {
  return (
    <Card>
      <CardHeader>
        <Lead className='font-medium text-foreground'>{title}</Lead>
      </CardHeader>

      <CardContent className='aspect-video p-0'>
        <Link href={href}>
          <Image
            alt=''
            src={image}
            width={768}
            height={432}
            className='object-cover'
          />
        </Link>
      </CardContent>
      <CardFooter className='flex items-center justify-between py-4'>
        {/* Footer text */}
        <div>
          <Small>
            Última atualização:{' '}
            <InlineCode>
              {format(updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
            </InlineCode>
          </Small>
        </div>
        {/* Actions */}
        <div className='flex items-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='hover:bg-primary hover:text-primary-foreground'
                  size='icon'
                  variant='outline'
                  asChild
                >
                  <Link href={`pages/${href}/edit`}>
                    <Edit className='h-5 w-5' />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editar página</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='hover:bg-primary hover:text-primary-foreground'
                  size='icon'
                  variant='outline'
                  asChild
                >
                  <Link href={`/${href}`}>
                    <Eye className='h-5 w-5' />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ver página</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  )
}
