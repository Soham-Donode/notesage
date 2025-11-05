import { NextResponse } from 'next/server';
import seedPosts from '@/lib/seed';

export async function POST() {
  try {
    await seedPosts();
    return NextResponse.json({ message: 'Seeded successfully' });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}