import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Fetch all data in parallel with proper error handling
    try {
      const [links, stores, categories] = await Promise.all([
        prisma.link.findMany({
          include: {
            store: true,
            category: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.store.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.category.findMany({
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return NextResponse.json({
        links,
        stores,
        categories,
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);
      return new NextResponse('Database Error', { status: 500 });
    }
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 