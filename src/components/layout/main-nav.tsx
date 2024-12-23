'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, Tags, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      active: pathname === '/',
    },
    {
      href: '/stores',
      label: 'Stores',
      icon: Store,
      active: pathname === '/stores',
    },
    {
      href: '/categories',
      label: 'Categories',
      icon: Tags,
      active: pathname === '/categories',
    },
    {
      href: '/admin',
      label: 'Admin',
      icon: User,
      active: pathname === '/admin',
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={route.active ? "default" : "ghost"}
          asChild
        >
          <Link
            href={route.href}
            className="flex items-center space-x-2"
          >
            <route.icon className="h-4 w-4" />
            <span>{route.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
} 