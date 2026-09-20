import { requireServerAuth } from '@/shared/server';
import React from 'react';

export interface AuthenticatedPageProps {
  user: {
    userId: number;
    username: string;
  };
}

export function withServerAuth<P extends object>(
  Component: React.ComponentType<P & AuthenticatedPageProps>,
) {
  return async function AuthenticatedRoute(props: P) {
    const userData = await requireServerAuth();

    return <Component {...props} user={userData} />;
  };
}
