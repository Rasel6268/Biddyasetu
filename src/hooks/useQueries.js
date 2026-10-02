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
 * Hook to fetch alumni members list
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
 * Example mutation: Event registration with optimistic updates and toast notifications
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
    },
    onError: (err) => {
      showError(err);
    },
  });
}
