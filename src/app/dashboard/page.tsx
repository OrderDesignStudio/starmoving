import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { StatusChart } from "@/components/dashboard/status-chart";
import { MonthlyChart } from "@/components/dashboard/monthly-chart";
import { RepComparison } from "@/components/dashboard/rep-comparison";
import { RecentCases } from "@/components/dashboard/recent-cases";
import { CASE_STATUS } from "@/lib/constants";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";
  const userFilter = isAdmin ? {} : { userId: session.user.id };

  // Fetch all cases for the current user/admin
  const allCases = await prisma.case.findMany({
    where: userFilter,
    include: { user: true, expenses: true },
    orderBy: { caseDate: "desc" },
  });

  // Stats
  const totalCases = allCases.length;
  const wonCases = allCases.filter((c) => c.status === CASE_STATUS.WON).length;
  const decidedCases = allCases.filter(
    (c) => c.status === CASE_STATUS.WON || c.status === CASE_STATUS.LOST_TO_COMPETITOR || c.status === CASE_STATUS.WON_CANCELLED
  ).length;
  const winRate = decidedCases > 0 ? (wonCases / decidedCases) * 100 : 0;

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthCases = allCases.filter((c) => new Date(c.caseDate) >= thisMonthStart).length;

  const totalRevenue = allCases.reduce((sum, c) => sum + (c.expenses?.estimateAmount || 0), 0);

  // Status distribution
  const statusCounts = Object.values(CASE_STATUS).map((status) => ({
    status,
    count: allCases.filter((c) => c.status === status).length,
  })).filter((d) => d.count > 0);

  // Monthly data (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const monthCases = allCases.filter((c) => {
      const cd = new Date(c.caseDate);
      return cd >= d && cd <= monthEnd;
    });
    monthlyData.push({
      month: `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      total: monthCases.length,
      won: monthCases.filter((c) => c.status === CASE_STATUS.WON).length,
    });
  }

  // Rep comparison (admin only)
  let repData: { name: string; total: number; won: number; rate: number }[] = [];
  if (isAdmin) {
    const reps = await prisma.user.findMany({
      where: { role: "SALES_REP" },
      include: { cases: true },
    });
    repData = reps.map((rep) => {
      const total = rep.cases.length;
      const won = rep.cases.filter((c) => c.status === CASE_STATUS.WON).length;
      const decided = rep.cases.filter(
        (c) => c.status === CASE_STATUS.WON || c.status === CASE_STATUS.LOST_TO_COMPETITOR || c.status === CASE_STATUS.WON_CANCELLED
      ).length;
      return {
        name: rep.name,
        total,
        won,
        rate: decided > 0 ? (won / decided) * 100 : 0,
      };
    });
  }

  // Recent cases
  const recentCases = allCases.slice(0, 10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>

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
