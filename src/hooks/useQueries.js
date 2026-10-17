import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utility/config";
import { showSuccess, showError } from "@/utility/toast";

/**
 * Hook to fetch current authenticated user profile
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.get("/auth/auth_me");
      return response.data?.data?.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch events
 */
export function useEvents(filter = {}) {
  return useQuery({
    queryKey: ["events", filter],
    queryFn: async () => {
      const response = await api.get("/events", { params: filter });
      return response.data?.data ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch current user's registered events and attendance passes
 */
export function useMyEvents(userIdentifier = null) {
  const userId = typeof userIdentifier === "object" ? userIdentifier?._id || userIdentifier?.id : userIdentifier;
  const userPhone = typeof userIdentifier === "object" ? userIdentifier?.phone : undefined;
  const userEmail = typeof userIdentifier === "object" ? userIdentifier?.email : undefined;

  return useQuery({
    queryKey: ["myEvents", userId, userPhone, userEmail],
    queryFn: async () => {
      const response = await api.get("/events/my-events", {
        params: {
          userId: userId || undefined,
          phone: userPhone || undefined,
          email: userEmail || undefined,
        },
      });
      return response.data?.data ?? [];
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch alumni members list (Public)
 */
export function useMembers(params = {}) {
  return useQuery({
    queryKey: ["members", params],
    queryFn: async () => {
      const response = await api.get("/members", { params });
      return response.data?.data ?? [];
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch all members for Admin Directory
 */
export function useAdminMembers(params = {}) {
  return useQuery({
    queryKey: ["adminMembers", params],
    queryFn: async () => {
      const response = await api.get("/members/admin/all", { params });
      return response.data?.data ?? [];
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch member summary statistics
 */
export function useMemberStats() {
  return useQuery({
    queryKey: ["memberStats"],
    queryFn: async () => {
      const response = await api.get("/members/stats");
      return response.data?.data ?? {};
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to update member status (Admin)
 */
export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, statusData }) => {
      const response = await api.put(`/members/${id}/status`, statusData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Member status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      queryClient.invalidateQueries({ queryKey: ["memberStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to fetch Admin Dashboard overview metrics and queues
 */
export function useAdminDashboardStats() {
  return useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const response = await api.get("/members/admin/dashboard-stats");
      return response.data?.data ?? null;
    },
    staleTime: 15 * 1000,
  });
}

/**
 * Hook to onboard new member by Admin
 */
export function useOnboardMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberData) => {
      const response = await api.post("/members/admin/create", memberData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Member onboarded successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      queryClient.invalidateQueries({ queryKey: ["memberStats"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to verify / reconcile payment transaction (Admin)
 */
export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentIdOrTrxId) => {
      const response = await api.put(`/ssl/${paymentIdOrTrxId}/verify`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Transaction verified and reconciled!");
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      queryClient.invalidateQueries({ queryKey: ["memberStats"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to update member full profile (Admin)
 */
export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, memberData }) => {
      const response = await api.put(`/members/${id}`, memberData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Member profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to delete a member (Admin)
 */
export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/members/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Member deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminMembers"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      queryClient.invalidateQueries({ queryKey: ["memberStats"] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook for Event registration / RSVP
 */
export function useRegisterEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, memberData }) => {
      const response = await api.post(`/events/${eventId}/register`, memberData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Successfully registered for event!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["myEvents"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to create event (Admin)
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData) => {
      const response = await api.post("/events", eventData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Event created successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to update event (Admin)
 */
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, eventData }) => {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to delete event (Admin)
 */
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId) => {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to fetch announcements (Notice Board)
 */
export function useAnnouncements(filter = {}) {
  return useQuery({
    queryKey: ["announcements", filter],
    queryFn: async () => {
      const response = await api.get("/announcements", { params: filter });
      return response.data?.data ?? [];
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to create announcement (Admin)
 */
export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (announcementData) => {
      const response = await api.post("/announcements", announcementData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Notice published successfully!");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to update announcement (Admin)
 */
export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/announcements/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Notice updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to delete announcement (Admin)
 */
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/announcements/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Notice deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to fetch active membership packages (Public)
 */
export function useMembershipPackages() {
  return useQuery({
    queryKey: ["membershipPackages"],
    queryFn: async () => {
      const response = await api.get("/membership-packages");
      return response.data?.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch all membership packages for Admin
 */
export function useAdminMembershipPackages() {
  return useQuery({
    queryKey: ["adminMembershipPackages"],
    queryFn: async () => {
      const response = await api.get("/membership-packages/admin");
      return response.data?.data ?? [];
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create a membership package (Admin)
 */
export function useCreateMembershipPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageData) => {
      const response = await api.post("/membership-packages", packageData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Package created successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminMembershipPackages"] });
      queryClient.invalidateQueries({ queryKey: ["membershipPackages"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to update a membership package (Admin)
 */
export function useUpdateMembershipPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, packageData }) => {
      const response = await api.put(`/membership-packages/${id}`, packageData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Package updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminMembershipPackages"] });
      queryClient.invalidateQueries({ queryKey: ["membershipPackages"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to toggle package active status (Admin)
 */
export function useToggleMembershipPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.patch(`/membership-packages/${id}/toggle`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Package status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminMembershipPackages"] });
      queryClient.invalidateQueries({ queryKey: ["membershipPackages"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to delete a membership package (Admin)
 */
export function useDeleteMembershipPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/membership-packages/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Package deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminMembershipPackages"] });
      queryClient.invalidateQueries({ queryKey: ["membershipPackages"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to fetch gallery activities
 */
export function useGallery(params = {}) {
  const { category, search, sortBy } = params;
  return useQuery({
    queryKey: ["gallery", category, search, sortBy],
    queryFn: async () => {
      const response = await api.get("/gallery", { params });
      return response.data?.data || [];
    },
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create/upload gallery activity
 */
export function useCreateGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/gallery", data);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Activity photo shared successfully!");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to toggle like on gallery item
 */
export function useToggleGalleryLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/gallery/${id}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to delete gallery item
 */
export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/gallery/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Activity deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to fetch dynamic Date-to-Date Financial Statement & Ledger
 */
export function useFinancialReport(params = {}) {
  return useQuery({
    queryKey: ["financialReport", params],
    queryFn: async () => {
      const response = await api.get("/financial-reports", { params });
      return response.data?.data ?? null;
    },
    staleTime: 20 * 1000,
  });
}

/**
 * Hook to record manual income (donation) or expense voucher
 */
export function useCreateFinancialRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recordData) => {
      const response = await api.post("/financial-reports/records", recordData);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Record saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["financialReport"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}

/**
 * Hook to delete manual financial record
 */
export function useDeleteFinancialRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/financial-reports/records/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      showSuccess(data?.message || "Record deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["financialReport"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
    },
    onError: (err) => {
      showError(err);
    },
  });
}




