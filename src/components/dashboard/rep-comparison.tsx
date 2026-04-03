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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="案件数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="won" name="成約数" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Rate table */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {data.map((rep) => (
            <div key={rep.name} className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-500">{rep.name}</p>
              <p className="text-lg font-bold text-blue-600">{rep.rate.toFixed(1)}%</p>
              <p className="text-xs text-gray-400">成約率</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
