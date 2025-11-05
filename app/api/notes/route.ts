import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Note from '@/models/Note';

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({
      'authProvider.provider': 'clerk',
      'authProvider.providerUserId': clerkId,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let query: any = { userId: user._id };

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content, role, tags, isPublic } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({
      'authProvider.provider': 'clerk',
      'authProvider.providerUserId': clerkId,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const note = await Note.create({
      userId: user._id,
      title,
      content,
      role: role || 'General',
      tags: tags || [],
      isPublic: isPublic || false,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, content, role, tags, isPublic } = await request.json();

    if (!id || !title || !content) {
      return NextResponse.json({ error: 'ID, title and content are required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({
      'authProvider.provider': 'clerk',
      'authProvider.providerUserId': clerkId,
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: user._id },
      {
        title,
        content,
        role: role || 'General',
        tags: tags || [],
        isPublic: isPublic || false,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}