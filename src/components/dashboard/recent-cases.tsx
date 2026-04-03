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
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-gray-600">顧客名</th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-600">担当者</th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-600">種別</th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-600">状況</th>
                <th className="px-4 py-2.5 text-left font-medium text-gray-600">案件発生日</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <Link href={`/cases/${c.id}`} className="text-blue-600 hover:underline font-medium">
                      {c.customerName}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-gray-600">{c.user.name}</td>
                  <td className="px-4 py-2.5 text-gray-600">{CASE_TYPE_LABELS[c.caseType] || c.caseType}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-2.5 text-gray-600">{formatDate(c.caseDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
