import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({ url: '/auth/register', method: 'POST', body: credentials }),
    }),
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
    }),
    getTasks: builder.query({
      query: (params) => ({ url: '/tasks', params }),
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (task) => ({ url: '/tasks', method: 'POST', body: task }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({ url: `/tasks/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
    toggleTask: builder.mutation({
      query: (id) => ({ url: `/tasks/${id}/toggle`, method: 'PATCH' }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useToggleTaskMutation,
} = taskApi;
