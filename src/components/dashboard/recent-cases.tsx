import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/cases/status-badge";
import { formatDate } from "@/lib/utils";
import { CASE_TYPE_LABELS } from "@/lib/constants";

interface RecentCase {
  id: string;
  customerName: string;
  caseType: string;
  status: string;
  caseDate: Date;
  user: { name: string };
}

export function RecentCases({ cases }: { cases: RecentCase[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>直近の案件</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]">
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">顧客名</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">担当者</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">種別</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">状況</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">案件発生日</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-3">
                    <Link href={`/cases/${c.id}`} className="text-[#171717] hover:text-[#0072f5] font-medium transition-colors">
                      {c.customerName}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-[#666666]">{c.user.name}</td>
                  <td className="px-6 py-3 text-[#666666]">{CASE_TYPE_LABELS[c.caseType] || c.caseType}</td>
                  <td className="px-6 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-6 py-3 text-[#666666] font-mono text-xs">{formatDate(c.caseDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
