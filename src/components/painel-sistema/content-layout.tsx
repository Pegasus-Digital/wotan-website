'use client'

import { Navbar } from './navbar'

interface ContentLayoutProps {
  title: string
  children: React.ReactNode
  navbarButtons?: React.ReactNode
}

export function ContentLayout({
  title,
  children,
  navbarButtons,
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} children={navbarButtons} />
      <div className=' px-4 pb-8 pt-8 tablet:px-8'>{children}</div>
    </div>
  )
}
