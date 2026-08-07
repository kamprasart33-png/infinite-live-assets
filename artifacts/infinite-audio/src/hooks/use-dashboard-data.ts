import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

const STALE = 30_000; // 30s

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["metrics", "dashboard"],
    queryFn: api.metrics.dashboard,
    staleTime: STALE,
  });
}

export function useRevenueHistory() {
  return useQuery({
    queryKey: ["metrics", "revenue-history"],
    queryFn: api.metrics.revenueHistory,
    staleTime: STALE,
  });
}

export function useDailySales() {
  return useQuery({
    queryKey: ["metrics", "daily-sales"],
    queryFn: api.metrics.dailySales,
    staleTime: STALE,
  });
}

export function useTracks() {
  return useQuery({
    queryKey: ["tracks"],
    queryFn: api.tracks.all,
    staleTime: 60_000,
  });
}

export function useTopTracks(limit = 10) {
  return useQuery({
    queryKey: ["tracks", "top-selling", limit],
    queryFn: () => api.tracks.topSelling(limit),
    staleTime: STALE,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: api.customers.all,
    staleTime: STALE,
  });
}

export function useRecentTransactions(limit = 10) {
  return useQuery({
    queryKey: ["transactions", "recent", limit],
    queryFn: () => api.transactions.recent(limit),
    staleTime: STALE,
  });
}

export function useActiveLicenses() {
  return useQuery({
    queryKey: ["transactions", "active-licenses"],
    queryFn: api.transactions.activeLicenses,
    staleTime: STALE,
  });
}

export function useLicensesByType() {
  return useQuery({
    queryKey: ["transactions", "by-type"],
    queryFn: api.transactions.byType,
    staleTime: STALE,
  });
}

export function useAstraCommand() {
  return useMutation({
    mutationFn: (command: string) => api.astra.command(command),
  });
}
