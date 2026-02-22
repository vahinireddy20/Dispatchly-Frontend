import { baseApi, type User } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => '/users/me',
            providesTags: ['User'],
        }),
        getAllUsers: builder.query<User[], void>({
            query: () => '/users',
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetMeQuery,
    useGetAllUsersQuery,
} = userApi;
