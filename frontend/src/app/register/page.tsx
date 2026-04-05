'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/lib/store/taskApi';
import { setCredentials } from '@/lib/store/authSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  const formik = useFormik({
    initialValues: { email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const result = await register({ email: values.email, password: values.password }).unwrap();
        dispatch(setCredentials(result));
        router.push('/dashboard');
      } catch (err: any) {
        console.error('Registration failed', err);
      }
    },
  });

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="glass-card p-5 w-100 animate-fade-in" style={{ maxWidth: '450px' }}>
        <h1 className="text-center mb-4 text-white fw-bold" style={{ fontFamily: 'Outfit' }}>Join QuantumTask</h1>
        <p className="text-center text-secondary mb-4">Start managing your personal tasks with speed and style.</p>

        {error && <div className="alert alert-danger" style={{ background: 'rgba(220, 53, 69, 0.2)', border: 'none', color: '#ff8080' }}>
          {(error as any).data?.message || 'Registration failed'}
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

          <div className="mb-3">
            <label className="form-label text-secondary small text-uppercase fw-bold ls-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label text-secondary small text-uppercase fw-bold ls-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && <div className="invalid-feedback">{formik.errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center" disabled={isLoading} style={{ height: '48px' }}>
            {isLoading ? <span className="spinner-border spinner-border-sm me-2" /> : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4 text-secondary small">
          Already have an account? <Link href="/login" className="text-primary text-decoration-none fw-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
