import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const links = await prisma.link.findMany({
      include: {
        store: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error('Failed to fetch links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, url, description, price, weight, shipping, storeId, categoryId, imageUrl } = data;

    if (!title || !url || !storeId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        description,
        price: price ? parseFloat(price) : null,
        weight: weight ? parseFloat(weight) : null,
        shipping: shipping ? parseFloat(shipping) : null,
        storeId,
        categoryId: categoryId || null,
        imageUrl: imageUrl || null,
      },
      include: {
        store: true,
        category: true,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Failed to create link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
} 