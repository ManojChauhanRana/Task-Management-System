'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="spinner-border text-primary" role="status" />
    </div>
  );
}
