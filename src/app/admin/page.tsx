import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { LoginForm } from './login-form'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session.user.isAdmin) {
    redirect('/')
  }

  const [stores, links] = await Promise.all([
    prisma.store.count(),
    prisma.link.count(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Stores</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stores}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{links}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 