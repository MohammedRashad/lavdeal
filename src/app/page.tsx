import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const links = await prisma.link.findMany({
    include: {
      store: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Latest Deals</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{link.title}</span>
                <span className="text-sm text-green-600">${link.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{link.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {link.store.name}
                </span>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Deal →
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 