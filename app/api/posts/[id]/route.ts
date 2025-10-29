import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    await dbConnect();

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Ensure comments field exists and is initialized
    if (!post.comments) {
      post.comments = '[]';
      await post.save();
    }

    // Parse comments
    let comments = [];
    try {
      comments = JSON.parse(post.comments);
    } catch (error) {
      comments = [];
      // Fix corrupted comments data
      post.comments = '[]';
      await post.save();
    }

    // Increment view count
    post.views = (post.views || 0) + 1;
    await post.save();

    return NextResponse.json({
      ...post.toObject(),
      comments,
      commentCount: comments.length
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}