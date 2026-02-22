import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        requestOtp: builder.mutation<any, { email?: string; phone?: string }>({
            query: (body) => ({
                url: '/auth/request-otp',
                method: 'POST',
                body,
            }),
        }),
        verifyOtp: builder.mutation<any, { email?: string; phone?: string; otp: string }>({
            query: (body) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body,
            }),
        }),
        setPassword: builder.mutation<any, { userId: number; password: string }>({
            query: (body) => ({
                url: '/auth/set-password',
                method: 'POST',
                body,
            }),
        }),
        login: builder.mutation<any, { identifier: string; password: string }>({
            query: (body) => ({
                url: '/auth/login',
                method: 'POST',
                body,
            }),
        }),
        completeProfile: builder.mutation<any, {
            phone?: string;
            email?: string;
            otp: string;
            name: string;
            newEmail: string;
            userId: number;
        }>({
            query: (body) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const {
    useRequestOtpMutation,
    useVerifyOtpMutation,
    useSetPasswordMutation,
    useLoginMutation,
    useCompleteProfileMutation,
} = authApi;
