import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    await dbConnect();

    const posts = await Post.find({ topic }).sort({ createdAt: -1 });

    // Ensure all posts have comments field initialized
    for (const post of posts) {
      if (!post.comments) {
        post.comments = '[]';
        await post.save();
      }
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, topic } = await request.json();

    if (!title || !content || !topic) {
      return NextResponse.json({ error: 'Title, content, and topic are required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({
      'authProvider.provider': 'clerk',
      'authProvider.providerUserId': clerkId,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await Post.create({
      title,
      content,
      topic,
      userId: user._id,
      userDisplayName: user.displayName,
      userAvatar: user.avatarUrl,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}