import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../lib/api/client';

/**
 * Component that sets up the auth token getter for the API client
 * This should be rendered inside ClerkProvider
 */
export function AuthTokenProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the token getter function for the API client
    setTokenGetter(async () => {
      try {
        return await getToken();
      } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
      }
    });
  }, [getToken]);

  return <>{children}</>;
}

