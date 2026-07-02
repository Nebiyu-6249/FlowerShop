import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/types";

const map: Record<OrderStatus, { tone: "sand" | "amber" | "sky" | "sage"; label: string }> = {
  "Placed": { tone: "sand", label: "Placed" },
  "Preparing": { tone: "amber", label: "Preparing" },
  "Out for Delivery": { tone: "sky", label: "Out for delivery" },
  "Delivered": { tone: "sage", label: "Delivered" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const m = map[status];
  return <Badge tone={m.tone}>{m.label}</Badge>;
}
