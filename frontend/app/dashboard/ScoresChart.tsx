"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const fakeScores = [
  { date: "2024-06-01", score: 800 },
  { date: "2024-06-02", score: 900 },
  { date: "2024-06-03", score: 950 },
  { date: "2024-06-04", score: 1000 },
  { date: "2024-06-05", score: 1100 },
  { date: "2024-06-06", score: 1200 },
];

export function ScoresChart() {
  return (
    <Card className="max-w-2xl mb-8">
      <CardHeader>
        <CardTitle>My Score History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={fakeScores} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00EF8B" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00EF8B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#00EF8B" fillOpacity={1} fill="url(#scoreColor)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 