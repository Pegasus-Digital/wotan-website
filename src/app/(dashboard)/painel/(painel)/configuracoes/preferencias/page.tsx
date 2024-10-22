'use client'

import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSidebar } from '@/hooks/use-sidebar'
import { useStore } from '@/hooks/use-store'

export default function DashboardPage() {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { settings, setSettings } = sidebar
  return (
    <ContentLayout title='Preferencias de Usuário'>
      <TooltipProvider>
        <div className='mt-6 flex gap-6'>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='is-hover-open'
                  onCheckedChange={(x) => setSettings({ isHoverOpen: x })}
                  checked={settings.isHoverOpen}
                />
                <Label htmlFor='is-hover-open'>
                  Abrir navegação lateral ao passar o mouse
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>When hovering on the sidebar in mini state, it will open</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='disable-sidebar'
                  onCheckedChange={(x) => setSettings({ disabled: x })}
                  checked={settings.disabled}
                />
                <Label htmlFor='disable-sidebar'>
                  Desativar navegação lateral
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Esconde completamente a sidebar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </ContentLayout>
  )
}
