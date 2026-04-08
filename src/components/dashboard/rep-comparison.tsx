"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RepComparisonProps {
  data: { name: string; total: number; won: number; rate: number }[];
}

export function RepComparison({ data }: RepComparisonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>担当者別成績</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
              <Legend />
              <Bar dataKey="total" name="案件数" fill="#171717" radius={[4, 4, 0, 0]} />
              <Bar dataKey="won" name="成約数" fill="#0a72ef" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {data.map((rep) => (
            <div key={rep.name} className="text-center p-3 rounded-[8px] shadow-[rgba(0,0,0,0.08)_0px_0px_0px_1px]">
              <p className="text-[11px] font-medium text-[#808080] uppercase tracking-wide font-mono">{rep.name}</p>
              <p className="text-[24px] font-semibold tracking-[-0.96px] text-[#171717]">{rep.rate.toFixed(1)}%</p>
              <p className="text-[11px] text-[#808080]">成約率</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
