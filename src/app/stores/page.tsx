import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function StoresPage() {
  const stores = await prisma.store.findMany({
    include: {
      links: true,
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stores</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <Card key={store.id}>
            <CardHeader>
              <CardTitle>{store.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {store.description}
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Latest Deals:</h4>
                {store.links.slice(0, 3).map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <span className="text-sm truncate flex-1">{link.title}</span>
                    <span className="text-sm text-green-600 ml-2">
                      ${link.price}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 