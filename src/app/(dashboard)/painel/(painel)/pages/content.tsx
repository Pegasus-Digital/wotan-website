import { Separator } from '@/components/ui/separator'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ImageIcon, Layout, Info, Globe, Users, ShoppingCart, Mail, FileText, Settings, Plus } from "lucide-react"
import Link from 'next/link'
import { Page } from '@/payload/payload-types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'home': Globe,
  'quem-somos': Users,
  'cases-de-sucesso': FileText,
  'clientes': Users,
  'perguntas-frequentes': Info,
}

const colorMap: Record<string, string> = {
  'home': "bg-blue-500",
  'quem-somos': "bg-green-500",
  'cases-de-sucesso': "bg-purple-500",
  'clientes': "bg-orange-500",
  'perguntas-frequentes': "bg-indigo-500",
}

interface PagesContentProps {
  pages: Page[]
}

export function PagesContent({ pages }: PagesContentProps) {
  const showNewPageCard = pages.length < 6
  
  const sortedPages = [...pages].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <ContentLayout title='Páginas'>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {sortedPages.map((page) => {
          const IconComponent = iconMap[page.slug || ''] || Globe
          const color = colorMap[page.slug || ''] || "bg-gray-500"
          const status = page._status === 'published' ? 'Publicado' : 'Rascunho'
          const lastModified = new Date(page.updatedAt).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
          const hasCarousel = Array.isArray(page.carousel) && page.carousel.length > 0

          return (
            <Card 
              key={page.id} 
              className="relative overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
              role="article"
              aria-label={`Card da página ${page.title}`}
            >
              <CardHeader className="pb-3 flex-none">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${color} text-white shrink-0`} aria-hidden="true">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{page.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge 
                        variant={status === "Publicado" ? "default" : "secondary"} 
                        className="text-xs shrink-0"
                        aria-label={`Status: ${status}`}
                      >
                        {status}
                      </Badge>
                      <span className="text-xs text-muted-foreground truncate" aria-label={`Última modificação: ${lastModified}`}>
                        {lastModified}
                      </span>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2 line-clamp-2">{page.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0 flex-1 flex flex-col justify-end">
                <div className="grid gap-2">
                  <Link href={`/painel/pages/${page.id}/edit/info`} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      aria-label={`Editar informações de ${page.title}`}
                    >
                      <Info className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                      <span className="truncate">Editar Informações e SEO</span>
                    </Button>
                  </Link>

                  <Link href={`/painel/pages/${page.id}/edit/carousel`} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      aria-label={`Editar carrossel de ${page.title}`}
                      disabled={!hasCarousel}
                    >
                      <ImageIcon className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                      <span className="truncate">Editar Carrossel</span>
                    </Button>
                  </Link>

                  <Link href={`/painel/pages/${page.id}/edit/layout`} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      aria-label={`Editar layout de ${page.title}`}
                    >
                      <Layout className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                      <span className="truncate">Editar Layout</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {showNewPageCard && (
          <Card 
            className="relative overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-dashed opacity-50"
            role="article"
            aria-label="Adicionar nova página"
          >
            <CardHeader className="pb-3 flex-none">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-200 text-gray-500 shrink-0" aria-hidden="true">
                  <Plus className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">Nova Página</CardTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge 
                      variant="secondary"
                      className="text-xs shrink-0"
                    >
                      Rascunho
                    </Badge>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                Adicione uma nova página ao seu website
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col justify-end">
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled
                >
                  <Info className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                  <span className="truncate">Editar Informações e SEO</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled
                >
                  <ImageIcon className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                  <span className="truncate">Editar Carrossel</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  disabled
                >
                  <Layout className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                  <span className="truncate">Editar Layout</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ContentLayout>
  )
}
