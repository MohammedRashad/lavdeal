import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  try {
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {
        password: hashedPassword,
        isAdmin: true,
      },
      create: {
        username: 'admin',
        password: hashedPassword,
        isAdmin: true,
      },
    })
    
    console.log('Admin user created:', admin)
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 