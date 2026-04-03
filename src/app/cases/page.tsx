import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cases/status-badge";
import { CASE_TYPE_LABELS, CASE_STATUS_LABELS } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { FilePlus, Eye } from "lucide-react";
import { CaseFilters } from "@/components/cases/case-filters";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; caseType?: string; search?: string; userId?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const isAdmin = session.user.role === "ADMIN";

  // Build where clause
  const where: Record<string, unknown> = {};
  if (!isAdmin) {
    where.userId = session.user.id;
  } else if (params.userId) {
    where.userId = params.userId;
  }
  if (params.status) where.status = params.status;
  if (params.caseType) where.caseType = params.caseType;
  if (params.search) {
    where.customerName = { contains: params.search };
  }

  const cases = await prisma.case.findMany({
    where,
    include: { user: true, expenses: true },
    orderBy: { caseDate: "desc" },
  });

  const users = isAdmin
    ? await prisma.user.findMany({ where: { role: "SALES_REP" }, select: { id: true, name: true }, orderBy: { name: "asc" } })
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">案件一覧</h1>
        <Link href="/cases/new">
          <Button>
            <FilePlus className="h-4 w-4 mr-2" />
            新規案件
          </Button>
        </Link>
      </div>

      <CaseFilters
        currentStatus={params.status}
        currentCaseType={params.caseType}
        currentSearch={params.search}
        currentUserId={params.userId}
        isAdmin={isAdmin}
        users={users}
      />

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {isAdmin && <th className="px-4 py-3 text-left font-medium text-gray-600">担当者</th>}
                <th className="px-4 py-3 text-left font-medium text-gray-600">顧客名</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">種別</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">状況</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">案件発生日</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">移転日</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">見積金額</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-4 py-8 text-center text-gray-500">
                    案件がありません
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    {isAdmin && <td className="px-4 py-3 text-gray-700">{c.user.name}</td>}
                    <td className="px-4 py-3 font-medium text-gray-900">{c.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{CASE_TYPE_LABELS[c.caseType] || c.caseType}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(c.caseDate)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(c.movingDate)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(c.expenses?.estimateAmount)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/cases/${c.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
          全 {cases.length} 件
        </div>
      </div>
    </div>
  );
}
