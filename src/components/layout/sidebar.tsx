'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Home, Store, FileText, User, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Stores', href: '/stores', icon: Store },
  { name: 'Categories', href: '/categories', icon: FileText },
  { name: 'Admin', href: '/admin', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 shrink-0 items-center px-6">
          <h1 className="text-2xl font-bold text-card-foreground">Lav Deal</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 mx-2'
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
            <li className="mt-auto px-4 pb-4">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
} 