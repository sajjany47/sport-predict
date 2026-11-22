/**
 * Single source of truth for purchasable credit plans.
 *
 * The subscription page uses this list for display and the payment API uses
 * it for pricing — the client can only send a plan id, never its own amount,
 * so a crafted request cannot buy credits cheaply.
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  tokens: number;
  price: number;
  description: string;
  features: string[];
  color: string;
  popular: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tokens: 1,
    price: 49,
    description: "Perfect for a single analysis",
    features: ["1 AI Analysis Credit", "Standard Support", "Instant Access"],
    color: "from-blue-500 to-blue-600",
    popular: false,
  },
  {
    id: "standard",
    name: "Pro Analytics",
    tokens: 5,
    price: 199,
    description: "Best for weekend match analysis",
    features: [
      "5 AI Analysis Credits",
      "Priority Support",
      "Lifetime Validity",
      "Save ₹46",
    ],
    color: "from-violet-500 to-violet-600",
    popular: true,
  },
  {
    id: "premium",
    name: "Elite Analytics",
    tokens: 15,
    price: 599,
    description: "For the ultimate analyst",
    features: [
      "15 AI Analysis Credits",
      "VIP Support",
      "Lifetime Validity",
      "Save ₹136",
    ],
    color: "from-amber-500 to-amber-600",
    popular: false,
  },
];

export function getPlanById(id: unknown): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id) ?? null;
}
