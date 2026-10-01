import { useLicensePrices } from "./use-dashboard-data";

export function useLicenseStartingPrice(): string {
  const { data: prices = [], isLoading, isError } = useLicensePrices();

  if (isLoading) return "Loading prices…";
  if (isError) return "View license options";

  const amounts = prices
    .filter((price) =>
      price.currency.toLowerCase() === "usd" &&
      Number.isSafeInteger(price.unit_amount) &&
      price.unit_amount > 0
    )
    .map((price) => price.unit_amount);

  if (amounts.length === 0) return "View license options";

  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.min(...amounts) / 100);

  return `From ${amount}`;
}
