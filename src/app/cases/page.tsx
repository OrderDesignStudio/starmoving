import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cases/status-badge";
import { CASE_TYPE_LABELS } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { FilePlus, Eye } from "lucide-react";
import { CaseFilters } from "@/components/cases/case-filters";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 20;

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; caseType?: string; search?: string; userId?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;
  const isAdmin = session.user.role === "ADMIN";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

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

  const [cases, totalCount, users] = await Promise.all([
    prisma.case.findMany({
      where,
      include: {
        user: { select: { name: true } },
        expenses: { select: { estimateAmount: true } },
      },
      orderBy: { caseDate: "desc" },
      take: PAGE_SIZE,
      skip: (currentPage - 1) * PAGE_SIZE,
    }),
    prisma.case.count({ where }),
    isAdmin
      ? prisma.user.findMany({ where: { role: "SALES_REP" }, select: { id: true, name: true }, orderBy: { name: "asc" } })
      : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717]">案件一覧</h1>
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

      <div className="rounded-[8px] bg-white shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_2px] overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="shadow-[inset_0_-1px_0_rgba(0,0,0,0.08)]">
                {isAdmin && <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">担当者</th>}
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">顧客名</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">種別</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">状況</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">案件発生日</th>
                <th className="px-6 py-3 text-left text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">移転日</th>
                <th className="px-6 py-3 text-right text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">見積金額</th>
                <th className="px-6 py-3 text-center text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">操作</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center text-[#808080]">
                    案件がありません
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} className="shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)] hover:bg-[#fafafa] transition-colors">
                    {isAdmin && <td className="px-6 py-3 text-[#4d4d4d]">{c.user.name}</td>}
                    <td className="px-6 py-3 font-medium text-[#171717]">{c.customerName}</td>
                    <td className="px-6 py-3 text-[#666666]">{CASE_TYPE_LABELS[c.caseType] || c.caseType}</td>
                    <td className="px-6 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-6 py-3 text-[#666666] font-mono text-xs">{formatDate(c.caseDate)}</td>
                    <td className="px-6 py-3 text-[#666666] font-mono text-xs">{formatDate(c.movingDate)}</td>
                    <td className="px-6 py-3 text-right text-[#4d4d4d] font-mono text-xs">{formatCurrency(c.expenses?.estimateAmount)}</td>
                    <td className="px-6 py-3 text-center">
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
        <div className="shadow-[inset_0_1px_0_rgba(0,0,0,0.08)] px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-[#808080] font-mono">
            全 {totalCount} 件中 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, totalCount)} 件表示
          </span>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
        </div>
      </div>
    </div>
  );
}
