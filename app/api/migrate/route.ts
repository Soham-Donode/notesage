import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Update all posts that don't have comments field
    const result = await Post.updateMany(
      { comments: { $exists: false } },
      { $set: { comments: '[]', views: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} posts`);

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
      message: `Migration completed. Updated ${result.modifiedCount} posts.`
    });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}