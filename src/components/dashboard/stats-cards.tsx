import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, TrendingUp, Calendar } from "lucide-react";

interface StatsCardsProps {
  totalCases: number;
  wonCases: number;
  winRate: number;
  thisMonthCases: number;
  totalRevenue: number;
}

export function StatsCards({ totalCases, wonCases, winRate, thisMonthCases, totalRevenue }: StatsCardsProps) {
  const stats = [
    { label: "案件総数", value: totalCases.toString(), icon: FileText },
    { label: "成約数", value: wonCases.toString(), icon: CheckCircle },
    { label: "成約率", value: `${winRate.toFixed(1)}%`, icon: TrendingUp },
    { label: "今月の案件", value: thisMonthCases.toString(), icon: Calendar },
    { label: "売上合計", value: `¥${totalRevenue.toLocaleString("ja-JP")}`, icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-[#808080] uppercase tracking-wide font-mono">
                  {stat.label}
                </p>
                <p className="text-[28px] font-semibold tracking-[-1.28px] text-[#171717] mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className="h-4 w-4 text-[#808080]" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
