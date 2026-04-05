'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/lib/store/taskApi';

interface TaskFormProps {
  onSuccess: () => void;
  initialValues?: { id?: number; title: string; description?: string | null };
}

export default function TaskForm({ onSuccess, initialValues }: TaskFormProps) {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const formik = useFormik({
    initialValues: {
      title: initialValues?.title || '',
      description: initialValues?.description || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        if (initialValues?.id) {
          await updateTask({ id: initialValues.id, ...values }).unwrap();
        } else {
          await createTask(values).unwrap();
        }
        formik.resetForm();
        onSuccess();
      } catch (err) {
        console.error('Task action failed', err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-3">
        <label className="form-label text-secondary small fw-bold text-uppercase ls-1">Task Title</label>
        <input
          name="title"
          className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          placeholder="e.g., Complete Project Assessment"
        />
        {formik.touched.title && formik.errors.title && <div className="invalid-feedback">{formik.errors.title}</div>}
      </div>
      <div className="mb-4">
        <label className="form-label text-secondary small fw-bold text-uppercase ls-1">Description (Optional)</label>
        <textarea
          name="description"
          rows={3}
          className="form-control"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
          placeholder="Details about the task..."
        />
      </div>
      <button type="submit" className="btn btn-primary w-100 fw-bold border-0" disabled={isCreating || isUpdating} style={{ height: '48px' }}>
        {isCreating || isUpdating ? <span className="spinner-border spinner-border-sm me-2" /> : initialValues?.id ? 'Update Task' : 'Save Task'}
      </button>
    </form>
  );
}
