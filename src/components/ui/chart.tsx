"use client"

import * as React from "react";
import { ResponsiveContainer } from "recharts";

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement
}

export function Chart({ children, ...props }: ChartProps) {
  return (
    <div {...props}>
      <ResponsiveContainer width="100%" height={350}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}