"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, FileText, Target, TrendingUp, Award } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { getMonthlyStats, getLeads } from "@/lib/supabase-store";
import { formatCurrency, calculateCommission } from "@/lib/format";
import { FUNNEL_STAGES } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getMonthlyStats>> | null>(null);
  const [commission, setCommission] = useState({ rate: 0, value: 0, bonus: 0 });
  const [recentLeads, setRecentLeads] = useState<{ company: string; stage: string; date: string }[]>([]);

  useEffect(() => {
    async function load() {
      const s = await getMonthlyStats();
      setStats(s);
      setCommission(calculateCommission(s.totalSales, s.monthlyGoal));

      const leads = await getLeads();
      const recent = leads
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)
        .map((l) => ({
          company: l.company,
          stage: FUNNEL_STAGES.find((f) => f.key === l.stage)?.label || l.stage,
          date: new Date(l.updated_at).toLocaleDateString("pt-BR"),
        }));
      setRecentLeads(recent);
    }
    load();
  }, []);

  if (!stats) return <div className="p-8 text-text-secondary">Carregando...</div>;

  const goalPercent = stats.goalPercent;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Visao geral das suas vendas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Vendas do Mes" value={formatCurrency(stats.totalSales)} subtitle={`Meta: ${formatCurrency(stats.monthlyGoal)}`} icon={<DollarSign size={24} />} color="#10B981" />
        <StatCard title="Total de Leads" value={String(stats.totalLeads)} subtitle={`${stats.closedCount} fechados`} icon={<Users size={24} />} color="#3B82F6" />
        <StatCard title="Orcamentos" value={formatCurrency(stats.totalQuoted)} icon={<FileText size={24} />} color="#F59E0B" />
        <StatCard title="Comissao" value={formatCurrency(commission.value + commission.bonus)} subtitle={`Taxa: ${(commission.rate * 100).toFixed(0)}%${commission.bonus > 0 ? " + bonus" : ""}`} icon={<Award size={24} />} color="#8B5CF6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Target size={20} className="text-primary" />
            <h2 className="font-semibold">Meta Mensal</h2>
          </div>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-primary">{goalPercent.toFixed(1)}%</p>
            <p className="text-sm text-text-secondary mt-1">{formatCurrency(stats.totalSales)} de {formatCurrency(stats.monthlyGoal)}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="h-4 rounded-full transition-all duration-500" style={{ width: `${Math.min(goalPercent, 100)}%`, background: goalPercent >= 100 ? "#10B981" : "#0B3D91" }} />
          </div>
          {goalPercent >= 100 && <p className="text-center text-sm font-medium mt-2" style={{ color: "#10B981" }}>Meta atingida! +0,5% de bonus</p>}
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="font-semibold">Funil de Vendas</h2>
          </div>
          <div className="space-y-3">
            {FUNNEL_STAGES.map(({ key, label, color }) => {
              const count = stats.leadsPerStage[key] || 0;
              const maxCount = Math.max(...Object.values(stats.leadsPerStage), 1);
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Leads Recentes</h2>
          {recentLeads.length === 0 ? (
            <p className="text-text-secondary text-sm">Nenhum lead cadastrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{lead.company}</p>
                    <p className="text-xs text-text-secondary">{lead.date}</p>
                  </div>
                  <span className="badge bg-blue-50 text-blue-700">{lead.stage}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
