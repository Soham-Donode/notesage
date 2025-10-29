import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, content } = await request.json();

    if (!postId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 });
    }

    await dbConnect();

    // Get user info
    const user = await User.findOne({
      'authProvider.provider': 'clerk',
      'authProvider.providerUserId': clerkId,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Ensure comments field exists and is initialized
    if (!post.comments) {
      post.comments = '[]';
    }

    // Parse existing comments
    let comments = [];
    try {
      comments = JSON.parse(post.comments);
    } catch (error) {
      comments = [];
      post.comments = '[]';
    }

    // Add new comment
    const newComment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      userId: user._id.toString(),
      userDisplayName: user.displayName,
      userAvatar: user.avatarUrl,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0
    };

    comments.push(newComment);

    // Save updated comments
    post.comments = JSON.stringify(comments);
    await post.save();

    return NextResponse.json({
      comment: newComment,
      totalComments: comments.length
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}