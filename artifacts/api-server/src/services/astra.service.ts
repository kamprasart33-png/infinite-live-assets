import { getDashboardMetrics, getRevenueHistory, getDailySales } from "./metrics.service";
import { getTopSellingTracks } from "./tracks.service";
import { getActiveLicenses, getRecentTransactions } from "./transactions.service";
import { getNewestCustomers, getActiveCustomers } from "./customers.service";

export interface AstraCommandResult {
  intent: string;
  label: string;
  data: unknown;
}

interface CommandHandler {
  patterns: RegExp[];
  intent: string;
  label: string;
  handler: () => Promise<unknown>;
}

const HANDLERS: CommandHandler[] = [
  {
    intent: "today_revenue",
    label: "Today's Revenue",
    patterns: [/today.*revenue/i, /revenue.*today/i, /how much.*today/i, /today.*sales/i, /today.*earning/i],
    handler: async () => {
      const m = await getDashboardMetrics();
      return {
        todayRevenueCents: m.todayRevenueCents,
        monthlyRevenueCents: m.monthlyRevenueCents,
        totalRevenueCents: m.totalRevenueCents,
      };
    },
  },
  {
    intent: "monthly_revenue",
    label: "Monthly Revenue",
    patterns: [/month.*revenue/i, /revenue.*month/i, /this month/i, /monthly/i],
    handler: async () => {
      const m = await getDashboardMetrics();
      return { monthlyRevenueCents: m.monthlyRevenueCents, totalRevenueCents: m.totalRevenueCents };
    },
  },
  {
    intent: "dashboard_metrics",
    label: "Dashboard Metrics",
    patterns: [/metric/i, /overview/i, /summary/i, /stats/i, /dashboard/i, /numbers/i],
    handler: () => getDashboardMetrics(),
  },
  {
    intent: "top_tracks",
    label: "Top-Selling Tracks",
    patterns: [/top.*track/i, /best.*track/i, /selling.*track/i, /track.*top/i, /track.*best/i, /popular.*track/i, /top seller/i],
    handler: () => getTopSellingTracks(10),
  },
  {
    intent: "active_licenses",
    label: "Active Licenses",
    patterns: [/active.*licen/i, /licen.*active/i, /show.*licen/i, /list.*licen/i, /my licen/i, /all licen/i],
    handler: () => getActiveLicenses(20),
  },
  {
    intent: "recent_transactions",
    label: "Recent Transactions",
    patterns: [/recent.*transaction/i, /transaction.*recent/i, /latest.*sale/i, /sale.*latest/i, /recent.*sale/i],
    handler: () => getRecentTransactions(10),
  },
  {
    intent: "newest_customers",
    label: "Newest Customers",
    patterns: [/new.*customer/i, /customer.*new/i, /latest.*customer/i, /newest/i, /recent.*customer/i],
    handler: () => getNewestCustomers(10),
  },
  {
    intent: "active_customers",
    label: "Active Customers",
    patterns: [/active.*customer/i, /customer.*active/i, /list.*customer/i, /show.*customer/i, /my customer/i, /all customer/i],
    handler: () => getActiveCustomers(20),
  },
  {
    intent: "revenue_history",
    label: "Revenue History",
    patterns: [/history/i, /trend/i, /over time/i, /chart/i, /graph/i, /revenue.*month/i, /monthly.*revenue/i],
    handler: () => getRevenueHistory(),
  },
];

const FALLBACK_SUGGESTIONS = [
  `Try: "Show today's revenue"`,
  `Try: "Find my top-selling tracks"`,
  `Try: "Show active licenses"`,
  `Try: "List my newest customers"`,
  `Try: "Show dashboard metrics"`,
];

export async function handleAstraCommand(input: string): Promise<AstraCommandResult> {
  const normalized = input.trim();

  for (const h of HANDLERS) {
    if (h.patterns.some((p) => p.test(normalized))) {
      const data = await h.handler();
      return { intent: h.intent, label: h.label, data };
    }
  }

  // Unknown command — return helpful suggestions
  return {
    intent: "unknown",
    label: "Command not recognized",
    data: {
      message: `I didn't understand "${normalized}". Here are some things you can ask:`,
      suggestions: FALLBACK_SUGGESTIONS,
    },
  };
}
