import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

const STALE = 30_000; // 30s
const LIVE_REFETCH = 30_000; // auto-refresh every 30s

// Exponential backoff: 1s → 2s → 4s (matches QueryClient default; listed here for clarity)
const RETRY_DELAY = (attempt: number) => Math.min(1000 * 2 ** attempt, 8000);

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["metrics", "dashboard"],
    queryFn: api.metrics.dashboard,
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useRevenueHistory() {
  return useQuery({
    queryKey: ["metrics", "revenue-history"],
    queryFn: api.metrics.revenueHistory,
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useDailySales() {
  return useQuery({
    queryKey: ["metrics", "daily-sales"],
    queryFn: api.metrics.dailySales,
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: api.tracks.all,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useTopTracks(limit = 10) {
  return useQuery({
    queryKey: ["tracks", "top-selling", limit],
    queryFn: () => api.tracks.topSelling(limit),
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: api.customers.all,
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useRecentTransactions(limit = 10) {
  return useQuery({
    queryKey: ["transactions", "recent", limit],
    queryFn: () => api.transactions.recent(limit),
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useActiveLicenses() {
  return useQuery({
    queryKey: ["transactions", "active-licenses"],
    queryFn: api.transactions.activeLicenses,
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useLicensesByType() {
  return useQuery({
    queryKey: ["transactions", "by-type"],
    queryFn: api.transactions.byType,
    staleTime: STALE,
    refetchInterval: LIVE_REFETCH,
    placeholderData: keepPreviousData,
    retry: 3,
    retryDelay: RETRY_DELAY,
  });
}

export function useAstraCommand() {
  return useMutation({
    mutationFn: (command: string) => api.astra.command(command),
  });
}

// ── Store hooks ───────────────────────────────────────────────────────────

export function useStoreTracks() {
  return useQuery({
    queryKey: ["store", "tracks"],
    queryFn: api.store.tracks,
    staleTime: 60_000,
  });
}

export function useLicensePrices() {
  return useQuery({
    queryKey: ["store", "license-prices"],
    queryFn: api.store.licensePrices,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useOrder(sessionId: string | null) {
  return useQuery({
    queryKey: ["order", sessionId],
    queryFn: () => api.checkout.getSession(sessionId!),
    enabled: !!sessionId,
    retry: 2,
  });
}
