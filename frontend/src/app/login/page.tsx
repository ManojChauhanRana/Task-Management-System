'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/lib/store/taskApi';
import { setCredentials } from '@/lib/store/authSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        dispatch(setCredentials(result));
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Login failed', err);
      }
    },
  });

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="glass-card p-5 w-100 animate-fade-in" style={{ maxWidth: '450px' }}>
        <h1 className="text-center mb-4 text-white fw-bold" style={{ fontFamily: 'Outfit' }}>Welcome Back</h1>
        <p className="text-center text-secondary mb-4">Enter your credentials to manage your tasks.</p>

        {error && <div className="alert alert-danger" style={{ background: 'rgba(220, 53, 69, 0.2)', border: 'none', color: '#ff8080' }}>
          {(error as any).data?.message || 'Login failed'}
        </div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-secondary small text-uppercase fw-bold ls-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small text-uppercase fw-bold ls-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center" disabled={isLoading} style={{ height: '48px' }}>
            {isLoading ? <span className="spinner-border spinner-border-sm me-2" /> : 'Access Dashboard'}
          </button>
        </form>

        <div className="text-center mt-4 text-secondary small">
          Don't have an account? <Link href="/register" className="text-primary text-decoration-none fw-bold">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
