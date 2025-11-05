import { Webhook } from 'svix';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local');
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: any;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err: unknown) {
    console.error('Error verifying webhook:', (err as Error).message);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  await dbConnect();

  if (eventType === 'user.created') {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0]?.email_address;
    const displayName = `${first_name || ''} ${last_name || ''}`.trim() || email;

    try {
      const user = await User.create({
        authProvider: {
          provider: 'clerk',
          providerUserId: clerkId,
        },
        email,
        displayName,
        avatarUrl: image_url,
        profile: {},
      });
      console.log('User created:', user);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.code === 11000) {
        // Duplicate key error
        return new Response('User already exists', { status: 200 });
      }
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0]?.email_address;
    const displayName = `${first_name || ''} ${last_name || ''}`.trim() || email;

    try {
      await User.findOneAndUpdate(
        { 'authProvider.provider': 'clerk', 'authProvider.providerUserId': clerkId },
        {
          email,
          displayName,
          avatarUrl: image_url,
          updatedAt: new Date(),
        }
      );
      console.log('User updated');
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id: clerkId } = evt.data;

    try {
      await User.findOneAndDelete({
        'authProvider.provider': 'clerk',
        'authProvider.providerUserId': clerkId,
      });
      console.log('User deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}