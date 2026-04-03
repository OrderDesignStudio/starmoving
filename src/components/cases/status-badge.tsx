import { Badge } from "@/components/ui/badge";
import { CASE_STATUS_LABELS, CASE_STATUS_COLORS } from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={CASE_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}>
      {CASE_STATUS_LABELS[status] || status}
    </Badge>
  );
}
