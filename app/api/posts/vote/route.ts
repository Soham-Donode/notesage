import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, voteType } = await request.json();

    if (!postId || !['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json({ error: 'Post ID and valid vote type are required' }, { status: 400 });
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

    // Update vote counts
    if (voteType === 'upvote') {
      post.upvotes = (post.upvotes || 0) + 1;
    } else if (voteType === 'downvote') {
      post.downvotes = (post.downvotes || 0) + 1;
    }

    await post.save();

    return NextResponse.json({
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      score: post.upvotes - post.downvotes
    });
  } catch (error) {
    console.error('Error voting on post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}