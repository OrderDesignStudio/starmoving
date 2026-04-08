"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CASE_STATUS_LABELS } from "@/lib/constants";

interface StatusChartProps {
  data: { status: string; count: number }[];
}

const COLORS: Record<string, string> = {
  WON: "#171717",
  WON_CANCELLED: "#ff5b4f",
  APPOINTMENT: "#0a72ef",
  CONSIDERING: "#808080",
  ESTIMATE_SUBMITTED: "#666666",
  PRE_ESTIMATE: "#ebebeb",
  LOST_TO_COMPETITOR: "#de1d8d",
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
              <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#666666" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#666666" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
                  fontSize: "13px",
                }}
              />
              <Bar dataKey="value" name="件数" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status] || "#808080"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
