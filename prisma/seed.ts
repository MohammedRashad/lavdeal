const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      isAdmin: true,
    },
  })

  // Create some stores
  const store1 = await prisma.store.upsert({
    where: { name: 'Nike' },
    update: {},
    create: {
      name: 'Nike',
      description: 'Official Nike Store',
    },
  })

  const store2 = await prisma.store.upsert({
    where: { name: 'Adidas' },
    update: {},
    create: {
      name: 'Adidas',
      description: 'Official Adidas Store',
    },
  })

  // Create some categories
  const category1 = await prisma.category.upsert({
    where: { name: 'Shoes' },
    update: {},
    create: {
      name: 'Shoes',
      description: 'Footwear',
    },
  })

  const category2 = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: {
      name: 'Clothing',
      description: 'Apparel',
    },
  })

  // Create some links
  await prisma.link.upsert({
    where: { id: 'link1' },
    update: {},
    create: {
      id: 'link1',
      title: 'Nike Air Force 1',
      url: 'https://nike.com/air-force-1',
      description: 'Classic Nike sneakers',
      price: 99.99,
      weight: 1.0,
      shipping: 6000,
      storeId: store1.id,
      categoryId: category1.id,
    },
  })

  await prisma.link.upsert({
    where: { id: 'link2' },
    update: {},
    create: {
      id: 'link2',
      title: 'Adidas Ultraboost',
      url: 'https://adidas.com/ultraboost',
      description: 'Premium running shoes',
      price: 179.99,
      weight: 0.8,
      shipping: 4800,
      storeId: store2.id,
      categoryId: category1.id,
    },
  })

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 