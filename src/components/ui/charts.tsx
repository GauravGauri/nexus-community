"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface ChartDataPoint {
  name: string;
  [key: string]: any;
}

interface ChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  gridColor?: string;
  strokeColor?: string;
  fillColor?: string;
}

export function AnalyticsAreaChart({
  data,
  dataKey,
  strokeColor = "var(--primary)",
  fillColor = "rgba(99, 102, 241, 0.1)"
}: ChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full flex items-center justify-center text-muted-foreground text-sm">Loading Chart...</div>;
  }

  return (
    <div className="h-64 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" className="opacity-20" />
          <XAxis
            dataKey="name"
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              color: "var(--foreground)",
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#grad-${dataKey})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AnalyticsBarChart({
  data,
  dataKey,
  strokeColor = "var(--primary)"
}: ChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full flex items-center justify-center text-muted-foreground text-sm">Loading Chart...</div>;
  }

  return (
    <div className="h-64 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" className="opacity-20" />
          <XAxis
            dataKey="name"
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              color: "var(--foreground)",
            }}
          />
          <Bar dataKey={dataKey} fill={strokeColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
