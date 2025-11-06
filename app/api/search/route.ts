import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    await dbConnect();

    // Search in title and content, case-insensitive
    const searchRegex = new RegExp(query.trim(), 'i');

    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { topic: searchRegex },
        { userDisplayName: searchRegex }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('title content topic userDisplayName upvotes downvotes comments createdAt');

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}