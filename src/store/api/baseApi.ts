import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  role: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: number;
  assignedUserId?: number;
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Task'],
  endpoints: () => ({}),
});
