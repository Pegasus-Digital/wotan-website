import {
  Users,
  Settings,
  PackageOpen,
  PackageCheck,
  LayoutDashboard,
  FileUp,
  UserCog,
  Mailbox,
  ShoppingCart,
  Barcode,
  Tags,
  Bookmark,
  AppWindow,
  LayoutGrid,
  SquarePen,
  LucideIcon,
  Clock,
} from 'lucide-react'

type Submenu = {
  href: string
  label: string
  active?: boolean
}

type Menu = {
  href: string
  label: string
  active?: boolean
  icon: LucideIcon
  submenus?: Submenu[]
}

type Group = {
  groupLabel: string
  menus: Menu[]
}

const menusConfig: Record<string, Group[]> = {
  '/sistema': [
    {
      groupLabel: '',
      menus: [{ href: '/sistema', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      groupLabel: 'Menu',
      menus: [
        {
          href: '/sistema/catalogo/produtos',
          label: 'Produtos',
          icon: Barcode,
        },
        { href: '/sistema/orcamentos', label: 'Orçamentos', icon: PackageOpen },
        { href: '/sistema/pedidos', label: 'Pedidos', icon: PackageCheck },
        { href: '/sistema/clientes', label: 'Meus clientes', icon: Users },
        { href: '/sistema/contato', label: 'Mensagens', icon: Mailbox },
        {
          href: '/sistema/preferencias',
          label: 'Preferências',
          icon: Settings,
        },
      ],
    },
  ],
  '/painel': [
    {
      groupLabel: '',
      menus: [{ href: '/painel', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      groupLabel: 'Menu',
      menus: [
        {
          href: '',
          label: 'Catálogo',
          icon: ShoppingCart,
          submenus: [
            { href: '/painel/catalogo/produtos', label: 'Produtos' },
            { href: '/painel/catalogo/categorias', label: 'Categorias' },
            { href: '/painel/catalogo/atributos', label: 'Atributos' },
            {
              href: '/painel/catalogo/busca-avancada',
              label: 'Busca avançada',
            },
          ],
        },
        { href: '/painel/orcamentos', label: 'Orçamentos', icon: PackageOpen },
        { href: '/painel/pedidos', label: 'Pedidos', icon: PackageCheck },
        { href: '/painel/clientes', label: 'Clientes', icon: Users },
        { href: '/painel/vendedores', label: 'Vendedores', icon: Users },
        { href: '/painel/contato', label: 'Contato', icon: Mailbox },
        {
          href: '',
          label: 'Histórico',
          icon: Clock,
          submenus: [
            { href: '/painel/historico/orcamentos', label: 'Orçamentos' },
            { href: '/painel/historico/pedidos', label: 'Pedidos' },
          ],
        },
      ],
    },
    {
      groupLabel: 'Administração',
      menus: [
        { href: '/painel/pages', label: 'Páginas', icon: AppWindow },
        { href: '/painel/usuarios', label: 'Usuários', icon: UserCog },
        { href: '/painel/arquivos', label: 'Arquivos', icon: FileUp },
        {
          href: '/painel/configuracoes',
          label: 'Configurações',
          icon: Settings,
        },
      ],
    },
  ],
  default: [
    {
      groupLabel: '',
      menus: [
        {
          href: '/dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '',
          label: 'Posts',
          icon: SquarePen,
          submenus: [
            { href: '/posts', label: 'All Posts' },
            { href: '/posts/new', label: 'New Post' },
          ],
        },
        { href: '/categories', label: 'Categories', icon: Bookmark },
        { href: '/tags', label: 'Tags', icon: Tags },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        { href: '/users', label: 'Users', icon: Users },
        { href: '/account', label: 'Account', icon: Settings },
      ],
    },
  ],
}

export function getMenuList(pathname: string): Group[] {
  if (pathname.startsWith('/sistema')) {
    return menusConfig['/sistema']
  } else if (pathname.startsWith('/painel')) {
    return menusConfig['/painel']
  } else {
    return menusConfig['default']
  }
}
