"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageCircle, ArrowRight, ChevronRight } from "lucide-react";
import { getLeads, updateLeadStage } from "@/lib/supabase-store";
import { formatCurrency, whatsappLink } from "@/lib/format";
import { Lead, FUNNEL_STAGES, type FunnelStage } from "@/lib/types";

export default function FunilPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const reload = useCallback(() => { getLeads().then(setLeads); }, []);
  useEffect(() => { reload(); }, [reload]);

  async function moveStage(leadId: string, newStage: FunnelStage) {
    await updateLeadStage(leadId, newStage);
    reload();
  }

  function getNextStage(stage: FunnelStage): FunnelStage | null {
    const stages: FunnelStage[] = ["prospectado", "contato_feito", "orcamento_enviado", "negociacao", "fechado"];
    const idx = stages.indexOf(stage);
    if (idx === -1 || idx === stages.length - 1) return null;
    return stages[idx + 1];
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Funil de Vendas</h1>
        <p className="text-text-secondary text-sm mt-1">Arraste seus leads pelas etapas</p>
      </div>

      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {FUNNEL_STAGES.map(({ key, label, color }) => {
          const stageLeads = leads.filter((l) => l.stage === key);
          const totalValue = stageLeads.reduce((s, l) => s + l.estimated_value, 0);

          return (
            <div key={key} className="flex-shrink-0 w-64 md:w-72">
              <div className="rounded-t-lg px-4 py-3 flex items-center justify-between" style={{ background: color }}>
                <h3 className="text-white font-medium text-sm">{label}</h3>
                <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{stageLeads.length}</span>
              </div>
              {totalValue > 0 && (
                <div className="bg-white border-x border-border px-4 py-2">
                  <p className="text-xs text-text-secondary">Total: {formatCurrency(totalValue)}</p>
                </div>
              )}
              <div className="bg-gray-50 border border-t-0 border-border rounded-b-lg p-2 space-y-2 min-h-[200px]">
                {stageLeads.length === 0 ? (
                  <p className="text-center text-text-secondary text-xs py-8">Sem leads</p>
                ) : (
                  stageLeads.map((lead) => {
                    const next = getNextStage(key);
                    return (
                      <div key={lead.id} className="bg-white rounded-lg p-3 border border-border shadow-sm">
                        <p className="font-medium text-sm">{lead.company}</p>
                        {lead.contact_name && <p className="text-xs text-text-secondary mt-0.5">{lead.contact_name}</p>}
                        {lead.estimated_value > 0 && (
                          <p className="text-xs font-medium text-primary mt-1">{formatCurrency(lead.estimated_value)}</p>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          {lead.phone && (
                            <a href={whatsappLink(lead.phone)} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-green-50 text-green-600">
                              <MessageCircle size={14} />
                            </a>
                          )}
                          {next && (
                            <button
                              onClick={() => moveStage(lead.id, next)}
                              className="ml-auto flex items-center gap-1 text-xs text-primary hover:bg-blue-50 px-2 py-1 rounded"
                            >
                              Avançar <ChevronRight size={12} />
                            </button>
                          )}
                          {key !== "perdido" && key !== "fechado" && (
                            <button
                              onClick={() => moveStage(lead.id, "perdido")}
                              className="text-xs text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                            >
                              Perdido
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
