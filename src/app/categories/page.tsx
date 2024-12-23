import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function CategoriesPage() {
  const links = await prisma.link.findMany({
    include: {
      store: true,
      category: true,
    },
  })

  // Group links by category
  const categories = links.reduce((acc, link) => {
    const categoryName = link.category?.name || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(link)
    return acc
  }, {} as Record<string, typeof links>)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      <div className="space-y-8">
        {Object.entries(categories).map(([category, categoryLinks]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryLinks.map((link) => (
                <Card key={link.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{link.title}</span>
                      <span className="text-sm text-green-600">
                        ${link.price}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
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
        ))}
      </div>
    </div>
  )
} 