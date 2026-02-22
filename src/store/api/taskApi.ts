import { baseApi, type Task } from './baseApi';

export const taskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], void>({
            query: () => '/tasks',
            providesTags: ['Task'],
        }),
        createTask: builder.mutation<Task, Partial<Task>>({
            query: (body) => ({
                url: '/tasks',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation<Task, { id: number } & Partial<Task>>({
            query: ({ id, ...body }) => ({
                url: `/tasks/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Task'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
} = taskApi;
