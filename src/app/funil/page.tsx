"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MessageCircle, ChevronRight, GripVertical } from "lucide-react";
import { getLeads, updateLeadStage } from "@/lib/supabase-store";
import { formatCurrency, whatsappLink } from "@/lib/format";
import { Lead, FUNNEL_STAGES, type FunnelStage } from "@/lib/types";

export default function FunilPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<FunnelStage | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Touch drag state
  const touchRef = useRef<{
    lead: Lead;
    ghostEl: HTMLDivElement | null;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const reload = useCallback(() => { getLeads().then(setLeads); }, []);
  useEffect(() => { reload(); }, [reload]);

  async function moveStage(leadId: string, newStage: FunnelStage) {
    setIsUpdating(leadId);
    await updateLeadStage(leadId, newStage);
    await reload();
    setIsUpdating(null);
  }

  function getNextStage(stage: FunnelStage): FunnelStage | null {
    const stages: FunnelStage[] = ["prospectado", "contato_feito", "orcamento_enviado", "negociacao", "fechado"];
    const idx = stages.indexOf(stage);
    if (idx === -1 || idx === stages.length - 1) return null;
    return stages[idx + 1];
  }

  /* ── Drag handlers (mouse) ── */
  function handleDragStart(e: React.DragEvent, lead: Lead) {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", lead.id);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  }

  function handleDragEnd(e: React.DragEvent) {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedLead(null);
    setDragOverStage(null);
    setDragOverIdx(null);
  }

  function handleDragOver(e: React.DragEvent, stage: FunnelStage, idx?: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
    if (idx !== undefined) setDragOverIdx(idx);
  }

  function handleDragLeave(e: React.DragEvent) {
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !e.currentTarget.contains(related)) {
      setDragOverStage(null);
      setDragOverIdx(null);
    }
  }

  async function handleDrop(e: React.DragEvent, targetStage: FunnelStage) {
    e.preventDefault();
    setDragOverStage(null);
    setDragOverIdx(null);
    if (draggedLead && draggedLead.stage !== targetStage) {
      await moveStage(draggedLead.id, targetStage);
    }
    setDraggedLead(null);
  }

  /* ── Touch handlers (mobile) ── */
  function handleTouchStart(e: React.TouchEvent, lead: Lead) {
    const touch = e.touches[0];
    const ghost = document.createElement("div");
    ghost.className = "fixed pointer-events-none z-50 bg-white rounded-lg p-3 border-2 border-primary shadow-xl opacity-90";
    ghost.style.width = "180px";
    ghost.style.left = `${touch.clientX - 90}px`;
    ghost.style.top = `${touch.clientY - 30}px`;
    ghost.innerHTML = `<p class="font-medium text-sm">${lead.company}</p>`;
    document.body.appendChild(ghost);

    touchRef.current = {
      lead,
      ghostEl: ghost,
      startX: touch.clientX,
      startY: touch.clientY,
      moved: false,
    };
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchRef.current.startX);
    const dy = Math.abs(touch.clientY - touchRef.current.startY);

    if (dx > 5 || dy > 5) {
      touchRef.current.moved = true;
      e.preventDefault();
    }

    if (touchRef.current.ghostEl) {
      touchRef.current.ghostEl.style.left = `${touch.clientX - 90}px`;
      touchRef.current.ghostEl.style.top = `${touch.clientY - 30}px`;
    }

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el) {
      const col = el.closest("[data-stage]") as HTMLElement | null;
      if (col) {
        const stage = col.dataset.stage as FunnelStage;
        setDragOverStage(stage);
      } else {
        setDragOverStage(null);
      }
    }
  }

  async function handleTouchEnd() {
    if (!touchRef.current) return;
    const { lead, ghostEl, moved } = touchRef.current;

    if (ghostEl) {
      document.body.removeChild(ghostEl);
    }

    if (moved && dragOverStage && dragOverStage !== lead.stage) {
      await moveStage(lead.id, dragOverStage);
    }

    touchRef.current = null;
    setDraggedLead(null);
    setDragOverStage(null);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3rem)]">
      {/* Header compacto */}
      <div className="mb-3 flex-shrink-0">
        <h1 className="text-xl font-bold">Funil de Vendas</h1>
        <p className="text-text-secondary text-xs mt-0.5">Arraste os leads entre as etapas do funil</p>
      </div>

      {/* Grid de colunas — ocupa todo espaço restante */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 flex-1 min-h-0">
        {FUNNEL_STAGES.map(({ key, label, color }) => {
          const stageLeads = leads.filter((l) => l.stage === key);
          const totalValue = stageLeads.reduce((s, l) => s + l.estimated_value, 0);
          const isOver = dragOverStage === key && draggedLead && draggedLead.stage !== key;

          return (
            <div
              key={key}
              data-stage={key}
              className="flex flex-col min-h-0 transition-transform duration-150"
              style={{ transform: isOver ? "scale(1.01)" : undefined }}
              onDragOver={(e) => handleDragOver(e, key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, key)}
            >
              {/* Cabeçalho da coluna */}
              <div
                className="rounded-t-lg px-3 py-2 flex items-center justify-between flex-shrink-0"
                style={{ background: color }}
              >
                <h3 className="text-white font-medium text-xs truncate">{label}</h3>
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0">
                  {stageLeads.length}
                </span>
              </div>

              {/* Total valor */}
              {totalValue > 0 && (
                <div className="bg-white border-x border-border px-3 py-1 flex-shrink-0">
                  <p className="text-[10px] text-text-secondary">{formatCurrency(totalValue)}</p>
                </div>
              )}

              {/* Área de cards com scroll independente */}
              <div
                className={`border border-t-0 border-border rounded-b-lg p-1.5 space-y-1.5 flex-1 min-h-0 overflow-y-auto transition-all duration-200 ${
                  isOver
                    ? "bg-blue-50 border-primary ring-2 ring-primary/20"
                    : "bg-gray-50"
                }`}
              >
                {/* Drop indicator vazio */}
                {isOver && stageLeads.length === 0 && (
                  <div className="border-2 border-dashed border-primary/40 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-primary/60 font-medium">Soltar aqui</p>
                  </div>
                )}

                {stageLeads.length === 0 && !isOver ? (
                  <p className="text-center text-text-secondary text-[10px] py-6">Sem leads</p>
                ) : (
                  stageLeads.map((lead, idx) => {
                    const next = getNextStage(key);
                    const isDragging = draggedLead?.id === lead.id;
                    const updating = isUpdating === lead.id;

                    return (
                      <div key={lead.id}>
                        {isOver && dragOverIdx === idx && (
                          <div className="h-0.5 bg-primary/40 rounded-full mx-1 mb-1 transition-all" />
                        )}
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, key, idx)}
                          onTouchStart={(e) => handleTouchStart(e, lead)}
                          onTouchMove={(e) => handleTouchMove(e)}
                          onTouchEnd={handleTouchEnd}
                          className={`bg-white rounded-md p-2 border border-border shadow-sm select-none transition-all duration-200 ${
                            isDragging
                              ? "opacity-40 scale-95 border-dashed border-primary"
                              : updating
                              ? "opacity-60 animate-pulse"
                              : "hover:shadow-md hover:border-primary/30 cursor-grab active:cursor-grabbing"
                          }`}
                        >
                          <div className="flex items-start gap-1.5">
                            <div className="text-gray-300 mt-0.5 flex-shrink-0 hover:text-gray-500 transition-colors">
                              <GripVertical size={12} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs truncate">{lead.company}</p>
                              {lead.contact_name && (
                                <p className="text-[10px] text-text-secondary mt-0.5 truncate">{lead.contact_name}</p>
                              )}
                              {lead.estimated_value > 0 && (
                                <p className="text-[10px] font-medium text-primary mt-0.5">{formatCurrency(lead.estimated_value)}</p>
                              )}
                              {(lead.labels || []).length > 0 && (
                                <div className="flex flex-wrap gap-0.5 mt-1">
                                  {(lead.labels || []).map((lbl) => (
                                    <span key={lbl} className="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">🏷️ {lbl}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 mt-1.5 ml-4">
                            {lead.phone && (
                              <a
                                href={whatsappLink(lead.phone)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-0.5 rounded hover:bg-green-50 text-green-600"
                                onClick={(e) => e.stopPropagation()}
                                onDragStart={(e) => e.stopPropagation()}
                              >
                                <MessageCircle size={12} />
                              </a>
                            )}
                            {next && (
                              <button
                                onClick={(e) => { e.stopPropagation(); moveStage(lead.id, next); }}
                                onDragStart={(e) => e.stopPropagation()}
                                className="ml-auto flex items-center gap-0.5 text-[10px] text-primary hover:bg-blue-50 px-1.5 py-0.5 rounded"
                              >
                                Avançar <ChevronRight size={10} />
                              </button>
                            )}
                            {key !== "perdido" && key !== "fechado" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); moveStage(lead.id, "perdido"); }}
                                onDragStart={(e) => e.stopPropagation()}
                                className="text-[10px] text-red-500 hover:bg-red-50 px-1.5 py-0.5 rounded"
                              >
                                Perdido
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {isOver && stageLeads.length > 0 && (
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-1.5 text-center mt-0.5">
                    <p className="text-[10px] text-primary/50 font-medium">Soltar aqui</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
