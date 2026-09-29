import { getUncachableStripeClient } from "./stripeClient";

export interface LicensePrice {
  product_id: string;
  product_name: string;
  product_description: string | null;
  product_metadata: Record<string, string> | null;
  price_id: string;
  unit_amount: number;
  currency: string;
}

let _cachedPrices: LicensePrice[] | null = null;
let _cacheTs = 0;
const CACHE_TTL = 5 * 60_000; // 5 minutes
const LICENSE_TYPES = new Set(["Podcast", "YouTube", "Commercial", "Film", "Enterprise"]);

export class Storage {
  async getLicensePrices(): Promise<LicensePrice[]> {
    // Return from cache if fresh
    if (_cachedPrices && Date.now() - _cacheTs < CACHE_TTL) {
      return _cachedPrices;
    }

    const stripe = await getUncachableStripeClient();

    // Fetch all active products
    const products = await stripe.products.list({ active: true, limit: 20 });
    // Fetch all active prices
    const prices = await stripe.prices.list({ active: true, limit: 50 });

    const pricesByProduct = new Map<string, (typeof prices.data)[0]>();
    for (const p of prices.data) {
      if (p.type !== "one_time" || p.currency.toLowerCase() !== "usd" ||
          !p.unit_amount || p.unit_amount < 1) continue;
      const productId = typeof p.product === "string" ? p.product : p.product.id;
      // Keep the first (lowest-id) price per product
      if (!pricesByProduct.has(productId)) {
        pricesByProduct.set(productId, p);
      }
    }

    const result: LicensePrice[] = products.data
      .filter((prod) => LICENSE_TYPES.has(prod.metadata.license_type))
      .map((prod) => {
        const price = pricesByProduct.get(prod.id);
        if (!price) return null;
        return {
          product_id: prod.id,
          product_name: prod.name,
          product_description: prod.description ?? null,
          product_metadata: (prod.metadata as Record<string, string>) ?? null,
          price_id: price.id,
          unit_amount: price.unit_amount ?? 0,
          currency: price.currency,
        };
      })
      .filter(Boolean) as LicensePrice[];

    _cachedPrices = result;
    _cacheTs = Date.now();
    return result;
  }
}

export const storage = new Storage();
