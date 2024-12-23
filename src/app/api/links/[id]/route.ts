import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
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

    const link = await prisma.link.update({
      where: { id: params.id },
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
    console.error('Failed to update link:', error);
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.link.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Failed to delete link:', error);
    return NextResponse.json(
      { error: 'Failed to delete link' },
      { status: 500 }
    );
  }
} 