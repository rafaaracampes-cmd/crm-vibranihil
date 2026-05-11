"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, MessageCircle, Edit, Trash2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { LeadForm } from "@/components/LeadForm";
import { getLeads, saveLead, updateLead, deleteLead } from "@/lib/supabase-store";
import { formatCurrency, formatPhone, whatsappLink } from "@/lib/format";
import { Lead, LEAD_SEGMENTS, FUNNEL_STAGES, type LeadSegment, type FunnelStage } from "@/lib/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [filterSegment, setFilterSegment] = useState<LeadSegment | "all">("all");
  const [filterStage, setFilterStage] = useState<FunnelStage | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | undefined>();

  const reload = useCallback(() => { getLeads().then(setLeads); }, []);
  useEffect(() => { reload(); }, [reload]);

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    const matchSegment = filterSegment === "all" || l.segment === filterSegment;
    const matchStage = filterStage === "all" || l.stage === filterStage;
    return matchSearch && matchSegment && matchStage;
  });

  async function handleSave(data: Omit<Lead, "id" | "created_at" | "updated_at">) {
    if (editing) { await updateLead(editing.id, data); } else { await saveLead(data); }
    setModalOpen(false);
    setEditing(undefined);
    reload();
  }

  function handleEdit(lead: Lead) { setEditing(lead); setModalOpen(true); }

  async function handleDelete(id: string) {
    if (confirm("Excluir este lead?")) { await deleteLead(id); reload(); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Leads</h1>
          <p className="text-text-secondary text-sm mt-1">{leads.length} leads cadastrados</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(undefined); setModalOpen(true); }}>
          <Plus size={18} /> <span className="hidden sm:inline">Novo Lead</span>
        </button>
      </div>

      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input className="input pl-9" placeholder="Buscar empresa, contato ou cidade..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <select className="select flex-1 sm:w-auto sm:min-w-[150px]" value={filterSegment} onChange={(e) => setFilterSegment(e.target.value as LeadSegment | "all")}>
              <option value="all">Todos segmentos</option>
              {LEAD_SEGMENTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <select className="select flex-1 sm:w-auto sm:min-w-[150px]" value={filterStage} onChange={(e) => setFilterStage(e.target.value as FunnelStage | "all")}>
              <option value="all">Todas etapas</option>
              {FUNNEL_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card overflow-hidden p-0 hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-left text-text-secondary">
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Contato</th>
              <th className="px-4 py-3 font-medium">Segmento</th>
              <th className="px-4 py-3 font-medium">Etapa</th>
              <th className="px-4 py-3 font-medium">Valor Est.</th>
              <th className="px-4 py-3 font-medium">Cidade/UF</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-text-secondary">Nenhum lead encontrado.</td></tr>
            ) : filtered.map((lead) => {
              const stage = FUNNEL_STAGES.find((s) => s.key === lead.stage);
              const segment = LEAD_SEGMENTS.find((s) => s.key === lead.segment);
              return (
                <tr key={lead.id} className="table-row">
                  <td className="px-4 py-3 font-medium">{lead.company}</td>
                  <td className="px-4 py-3">
                    <div>{lead.contact_name}</div>
                    {lead.phone && <div className="text-xs text-text-secondary">{formatPhone(lead.phone)}</div>}
                  </td>
                  <td className="px-4 py-3"><span className="badge bg-blue-50 text-blue-700">{segment?.label}</span></td>
                  <td className="px-4 py-3"><span className="badge" style={{ background: `${stage?.color}20`, color: stage?.color }}>{stage?.label}</span></td>
                  <td className="px-4 py-3">{lead.estimated_value > 0 ? formatCurrency(lead.estimated_value) : "-"}</td>
                  <td className="px-4 py-3">{lead.city}{lead.city && lead.state ? "/" : ""}{lead.state}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      {lead.phone && <a href={whatsappLink(lead.phone)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="WhatsApp"><MessageCircle size={16} /></a>}
                      <button onClick={() => handleEdit(lead)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Editar"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Excluir"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-8 text-text-secondary text-sm">Nenhum lead encontrado.</div>
        ) : filtered.map((lead) => {
          const stage = FUNNEL_STAGES.find((s) => s.key === lead.stage);
          const segment = LEAD_SEGMENTS.find((s) => s.key === lead.segment);
          return (
            <div key={lead.id} className="card">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{lead.company}</p>
                  <p className="text-sm text-text-secondary">{lead.contact_name}</p>
                </div>
                <span className="badge text-xs" style={{ background: `${stage?.color}20`, color: stage?.color }}>{stage?.label}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-text-secondary mb-3">
                {lead.phone && <span>{formatPhone(lead.phone)}</span>}
                <span>{lead.city}/{lead.state}</span>
                <span className="badge bg-blue-50 text-blue-700">{segment?.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary">{lead.estimated_value > 0 ? formatCurrency(lead.estimated_value) : "-"}</span>
                <div className="flex gap-1">
                  {lead.phone && <a href={whatsappLink(lead.phone)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp text-xs py-1 px-2"><MessageCircle size={14} /> WhatsApp</a>}
                  <button onClick={() => handleEdit(lead)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(lead.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(undefined); }} title={editing ? "Editar Lead" : "Novo Lead"} maxWidth="max-w-2xl">
        <LeadForm initial={editing} onSubmit={handleSave} onCancel={() => { setModalOpen(false); setEditing(undefined); }} />
      </Modal>
    </div>
  );
}
