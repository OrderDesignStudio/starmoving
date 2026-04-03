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
    {
      label: "案件総数",
      value: totalCases.toString(),
      icon: FileText,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "成約数",
      value: wonCases.toString(),
      icon: CheckCircle,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "成約率",
      value: `${winRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "今月の案件",
      value: thisMonthCases.toString(),
      icon: Calendar,
      color: "text-orange-600 bg-orange-50",
    },
    {
      label: "売上合計",
      value: `¥${totalRevenue.toLocaleString("ja-JP")}`,
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
