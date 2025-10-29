import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let user = await User.findOne({
      'authProvider.provider': 'clerk',
      'authProvider.providerUserId': clerkId,
    });

    if (!user) {
      // User not in DB, fetch from Clerk and create
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const displayName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email;

      user = await User.create({
        authProvider: {
          provider: 'clerk',
          providerUserId: clerkId,
        },
        email,
        displayName,
        avatarUrl: clerkUser.imageUrl,
        profile: {},
      });
    }

    return NextResponse.json({
      id: user._id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}