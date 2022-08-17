import { apiSlice } from "../apiSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query({
      query: () => "/account/all",
      keepUnusedDataFor: 0,
    }),
    getAccountsDetail: builder.query({
      query: () => "/account/account-detail",
      keepUnusedDataFor: 0,
    }),
    getCustomersDetail: builder.query({
      query: () => "/account/all-customer",
      keepUnusedDataFor: 0,
    }),
    getStaffsDetail: builder.query({
      query: () => "/account/all-staff",
      keepUnusedDataFor: 0,
    }),
    getManagersDetail: builder.query({
      query: () => "/account/all-manager",
      keepUnusedDataFor: 0,
    }),
    getAccountByUsername: builder.mutation({
      query: (username) => ({
        url: `/account/${username}`,
        method: "GET",
      }),
    }),
    getAccountDetailByUsername: builder.query({
      query: (username) => `/account/${username}`,
      keepUnusedDataFor: 0,
    }),
    getAccountDetailById: builder.query({
      query: (_id) => `/account/byId/${_id}`,
      keepUnusedDataFor: 0,
    }),
    updatePassword: builder.mutation({
      query: (security) => ({
        url: "/account/change-password",
        method: "PATCH",
        body: {
          oldpass: security.oldPassword,
          repeatpass: security.confirmNewPassword,
          newpass: security.newPassword,
        },
      }),
    }),
    createStaff: builder.mutation({
      query: (staff) => ({
        url: "/account/register-staff",
        method: "POST",
        body: {
          username: staff.username,
          password: staff.password,
          role: staff.role,
          agency_id: staff.agency_id,
        },
      }),
    }),
    createManager: builder.mutation({
      query: (manager) => ({
        url: "/account/register-staff",
        method: "POST",
        body: {
          username: manager.username,
          password: manager.password,
          role: manager.role,
          agency_id: manager.agency_id,
        },
      }),
    }),
    viewOwnedProfile: builder.query({
      query: () => "/account/view-profile",
      keepUnusedDataFor: 0,
    }),
    updateProfileAccount: builder.mutation({
      query: (profile) => ({
        url: "/account/editprofile",
        method: "PATCH",
        body: {
          name: profile.name,
          phonenum: profile.phonenum,
          birth: profile.birth,
          email: profile.email,
        },
      }),
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useGetAccountsDetailQuery,
  useGetCustomersDetailQuery,
  useGetStaffsDetailQuery,
  useGetManagersDetailQuery,
  useGetAccountByUsernameMutation,
  useGetAccountDetailByUsernameQuery,
  useGetAccountDetailByIdQuery,
  useUpdatePasswordMutation,
  useCreateStaffMutation,
  useCreateManagerMutation,
  useViewOwnedProfileQuery,
  useUpdateProfileAccountMutation,
} = accountApiSlice;
