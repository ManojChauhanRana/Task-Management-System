'use client';

import { logout } from '@/lib/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom border-white border-opacity-10 py-3 mb-4">
      <div className="container">
        <span className="navbar-brand fw-bold fs-4 text-white" style={{ fontFamily: 'Outfit' }}>
          <span className="text-primary">Quantum</span>Task
        </span>
        {isAuthenticated && (
          <button className="btn btn-outline-danger btn-sm px-4 fw-bold border-0" onClick={handleLogout} style={{ background: 'rgba(220, 53, 69, 0.1)' }}>
            Sign Out
          </button>
        )}
      </div>
    </nav>
  );
}
