"use client";

import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  color?: string;
}

export function StatCard({ title, value, subtitle, icon, color = "#0B3D91" }: StatCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div
        className="p-3 rounded-lg flex-shrink-0"
        style={{ background: `${color}15` }}
      >
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        {subtitle && (
          <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
