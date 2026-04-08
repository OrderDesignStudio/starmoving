import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentCases } from "@/components/dashboard/recent-cases";
import { CASE_STATUS } from "@/lib/constants";
import dynamic from "next/dynamic";

const StatusChart = dynamic(() => import("@/components/dashboard/status-chart").then((m) => ({ default: m.StatusChart })), {
  loading: () => <div className="h-[380px] bg-white rounded-[8px] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] animate-pulse" />,
});
const MonthlyChart = dynamic(() => import("@/components/dashboard/monthly-chart").then((m) => ({ default: m.MonthlyChart })), {
  loading: () => <div className="h-[380px] bg-white rounded-[8px] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] animate-pulse" />,
});
const RepComparison = dynamic(() => import("@/components/dashboard/rep-comparison").then((m) => ({ default: m.RepComparison })), {
  loading: () => <div className="h-[380px] bg-white rounded-[8px] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px] animate-pulse" />,
});

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";
  const userFilter = isAdmin ? {} : { userId: session.user.id };

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalCases,
    wonCases,
    decidedCases,
    thisMonthCases,
    revenueResult,
    statusGroups,
    recentCases,
  ] = await Promise.all([
    prisma.case.count({ where: userFilter }),
    prisma.case.count({ where: { ...userFilter, status: CASE_STATUS.WON } }),
    prisma.case.count({
      where: {
        ...userFilter,
        status: { in: [CASE_STATUS.WON, CASE_STATUS.LOST_TO_COMPETITOR, CASE_STATUS.WON_CANCELLED] },
      },
    }),
    prisma.case.count({ where: { ...userFilter, caseDate: { gte: thisMonthStart } } }),
    prisma.caseExpense.aggregate({
      _sum: { estimateAmount: true },
      where: { case: userFilter },
    }),
    prisma.case.groupBy({
      by: ["status"],
      where: userFilter,
      _count: true,
    }),
    prisma.case.findMany({
      where: userFilter,
      include: { user: { select: { name: true } } },
      orderBy: { caseDate: "desc" },
      take: 10,
    }),
  ]);

  const totalRevenue = revenueResult._sum.estimateAmount || 0;
  const winRate = decidedCases > 0 ? (wonCases / decidedCases) * 100 : 0;

  const statusCounts = statusGroups.map((g) => ({
    status: g.status,
    count: g._count,
  }));

  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const monthlyCases = await prisma.case.findMany({
    where: { ...userFilter, caseDate: { gte: sixMonthsAgo } },
    select: { caseDate: true, status: true },
  });

  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const monthCases = monthlyCases.filter((c) => {
      const cd = new Date(c.caseDate);
      return cd >= d && cd <= monthEnd;
    });
    monthlyData.push({
      month: `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      total: monthCases.length,
      won: monthCases.filter((c) => c.status === CASE_STATUS.WON).length,
    });
  }

  let repData: { name: string; total: number; won: number; rate: number }[] = [];
  if (isAdmin) {
    const repGroups = await prisma.case.groupBy({
      by: ["userId"],
      _count: true,
    });
    const wonGroups = await prisma.case.groupBy({
      by: ["userId"],
      where: { status: CASE_STATUS.WON },
      _count: true,
    });
    const decidedGroups = await prisma.case.groupBy({
      by: ["userId"],
      where: { status: { in: [CASE_STATUS.WON, CASE_STATUS.LOST_TO_COMPETITOR, CASE_STATUS.WON_CANCELLED] } },
      _count: true,
    });
    const users = await prisma.user.findMany({
      where: { role: "SALES_REP" },
      select: { id: true, name: true },
    });

    repData = users.map((u) => {
      const total = repGroups.find((g) => g.userId === u.id)?._count || 0;
      const won = wonGroups.find((g) => g.userId === u.id)?._count || 0;
      const decided = decidedGroups.find((g) => g.userId === u.id)?._count || 0;
      return {
        name: u.name,
        total,
        won,
        rate: decided > 0 ? (won / decided) * 100 : 0,
      };
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717]">ダッシュボード</h1>

      <StatsCards
        totalCases={totalCases}
        wonCases={wonCases}
        winRate={winRate}
        thisMonthCases={thisMonthCases}
        totalRevenue={totalRevenue}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart data={statusCounts} />
        <MonthlyChart data={monthlyData} />
      </div>

      {isAdmin && repData.length > 0 && <RepComparison data={repData} />}

      <RecentCases cases={recentCases} />
    </div>
  );
}
