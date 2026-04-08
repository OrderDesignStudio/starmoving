"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MonthlyChartProps {
  data: { month: string; total: number; won: number }[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月次推移</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebebeb" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#666666" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#666666" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "rgba(0,0,0,0.08) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 2px",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="total" name="案件数" stroke="#171717" strokeWidth={2} dot={{ r: 3, fill: "#171717" }} />
              <Line type="monotone" dataKey="won" name="成約数" stroke="#0a72ef" strokeWidth={2} dot={{ r: 3, fill: "#0a72ef" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
