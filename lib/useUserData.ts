import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  profile: {
    bio?: string;
    tags?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export function useUserData() {
  const { user: clerkUser, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [clerkUser, isLoaded]);

  return { userData, loading, error };
}