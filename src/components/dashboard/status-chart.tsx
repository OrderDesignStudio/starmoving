"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CASE_STATUS_LABELS } from "@/lib/constants";

interface StatusChartProps {
  data: { status: string; count: number }[];
}

const COLORS: Record<string, string> = {
  WON: "#22c55e",
  WON_CANCELLED: "#ef4444",
  APPOINTMENT: "#3b82f6",
  CONSIDERING: "#eab308",
  ESTIMATE_SUBMITTED: "#a855f7",
  PRE_ESTIMATE: "#6b7280",
  LOST_TO_COMPETITOR: "#f97316",
};

export function StatusChart({ data }: StatusChartProps) {
  const chartData = data.map((d) => ({
    name: CASE_STATUS_LABELS[d.status] || d.status,
    value: d.count,
    status: d.status,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>ステータス別案件数</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" name="件数" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] || "#6b7280"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
