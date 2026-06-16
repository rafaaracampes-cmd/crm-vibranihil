"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, MessageCircle, Edit, Trash2, Globe, Download, CheckSquare, Square } from "lucide-react";
import * as XLSX from "xlsx";

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

import { Modal } from "@/components/Modal";
import { LeadForm } from "@/components/LeadForm";
import { getLeads, saveLead, updateLead, deleteLead } from "@/lib/supabase-store";
import { formatCurrency, formatPhone, whatsappLink } from "@/lib/format";
import { Lead, LEAD_SEGMENTS, FUNNEL_STAGES, LEAD_SOURCES, type LeadSegment, type FunnelStage, type LeadSource } from "@/lib/types";

function exportToExcel(leads: Lead[], filename = "leads_vibranihil") {
  const segmentLabel = (key: string) => LEAD_SEGMENTS.find((s) => s.key === key)?.label || key;
  const stageLabel = (key: string) => FUNNEL_STAGES.find((s) => s.key === key)?.label || key;
  const sourceLabel = (key: string) => LEAD_SOURCES.find((s) => s.key === key)?.label || key;

  const rows = leads.map((l) => ({
    "Empresa": l.company,
    "Contato": l.contact_name,
    "Telefone": l.phone,
    "Email": l.email,
    "Segmento": segmentLabel(l.segment),
    "Etapa": stageLabel(l.stage),
    "Origem": sourceLabel(l.source),
    "Etiquetas": (l.labels || []).join(", "),
    "Valor Estimado (R$)": l.estimated_value > 0 ? l.estimated_value : "",
    "Cidade": l.city,
    "Estado": l.state,
    "LinkedIn": l.linkedin_url,
    "Observações": l.notes,
    "Cadastrado em": l.created_at ? new Date(l.created_at).toLocaleDateString("pt-BR") : "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws["!cols"] = [
    { wch: 32 }, { wch: 22 }, { wch: 18 }, { wch: 28 },
    { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 18 },
    { wch: 18 }, { wch: 18 }, { wch: 8 },  { wch: 36 },
    { wch: 40 }, { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [filterSegment, setFilterSegment] = useState<LeadSegment | "all">("all");
  const [filterStage, setFilterStage] = useState<FunnelStage | "all">("all");
  const [filterSource, setFilterSource] = useState<LeadSource | "all">("all");
  const [filterLabel, setFilterLabel] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | undefined>();

  const reload = useCallback(() => { getLeads().then(setLeads); }, []);
  useEffect(() => { reload(); }, [reload]);

  const allLabels = Array.from(new Set(leads.flatMap((l) => l.labels || []))).sort();

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase());
    const matchSegment = filterSegment === "all" || l.segment === filterSegment;
    const matchStage = filterStage === "all" || l.stage === filterStage;
    const matchSource = filterSource === "all" || l.source === filterSource;
    const matchLabel = filterLabel === "all" || (l.labels || []).includes(filterLabel);
    return matchSearch && matchSegment && matchStage && matchSource && matchLabel;
  });

  const filteredIds = filtered.map((l) => l.id);
  const allFilteredSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someFilteredSelected = filteredIds.some((id) => selectedIds.has(id));
  const selectedCount = [...selectedIds].filter((id) => filteredIds.includes(id)).length;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }

  function selectBySegment(seg: LeadSegment) {
    const ids = filtered.filter((l) => l.segment === seg).map((l) => l.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handleExport() {
    const toExport = selectedCount > 0
      ? filtered.filter((l) => selectedIds.has(l.id))
      : filtered;
    exportToExcel(toExport);
  }

  async function handleSave(data: Omit<Lead, "id" | "created_at" | "updated_at">) {
    if (editing) { await updateLead(editing.id, data); } else { await saveLead(data); }
    setModalOpen(false);
    setEditing(undefined);
    reload();
  }

  function handleEdit(lead: Lead) { setEditing(lead); setModalOpen(true); }

  function googleSearchUrl(lead: Lead) {
    const q = [lead.company, lead.city, lead.state].filter(Boolean).join(" ");
    return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  }

  async function handleDelete(id: string) {
    if (confirm("Excluir este lead?")) { await deleteLead(id); reload(); }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Leads</h1>
          <p className="text-text-secondary text-sm mt-1">{leads.length} leads cadastrados</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(undefined); setModalOpen(true); }}>
          <Plus size={18} /> <span className="hidden sm:inline">Novo Lead</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input className="input pl-9" placeholder="Buscar empresa, contato ou cidade..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="select sm:min-w-[140px]" value={filterSegment} onChange={(e) => setFilterSegment(e.target.value as LeadSegment | "all")}>
              <option value="all">Todos segmentos</option>
              {LEAD_SEGMENTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <select className="select sm:min-w-[140px]" value={filterStage} onChange={(e) => setFilterStage(e.target.value as FunnelStage | "all")}>
              <option value="all">Todas etapas</option>
              {FUNNEL_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <select className="select sm:min-w-[130px]" value={filterSource} onChange={(e) => setFilterSource(e.target.value as LeadSource | "all")}>
              <option value="all">Todas origens</option>
              {LEAD_SOURCES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            {allLabels.length > 0 && (
              <select className="select sm:min-w-[130px]" value={filterLabel} onChange={(e) => setFilterLabel(e.target.value)}>
                <option value="all">Todas etiquetas</option>
                {allLabels.map((lbl) => <option key={lbl} value={lbl}>🏷️ {lbl}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Selection toolbar */}
      <div className="card mb-3 py-2.5 px-4 flex flex-wrap items-center gap-3">
        <button
          onClick={toggleSelectAll}
          className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          title={allFilteredSelected ? "Desmarcar todos" : "Selecionar todos visíveis"}
        >
          {allFilteredSelected ? <CheckSquare size={16} className="text-primary" /> : someFilteredSelected ? <CheckSquare size={16} className="text-amber-500" /> : <Square size={16} />}
          {allFilteredSelected ? "Desmarcar todos" : "Selecionar todos visíveis"}
        </button>

        <div className="h-4 w-px bg-border hidden sm:block" />

        <div className="flex flex-wrap gap-2">
          {LEAD_SEGMENTS.map((seg) => (
            <button
              key={seg.key}
              onClick={() => selectBySegment(seg.key)}
              className="text-xs px-2.5 py-1 rounded-lg border border-border hover:bg-surface hover:text-primary transition-colors"
            >
              + {seg.label}
            </button>
          ))}
        </div>

        {selectedCount > 0 && (
          <>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <span className="text-sm font-medium text-primary">{selectedCount} selecionado{selectedCount !== 1 ? "s" : ""}</span>
            <button onClick={clearSelection} className="text-xs text-text-secondary hover:text-red-500 transition-colors">Limpar seleção</button>
          </>
        )}

        <div className="ml-auto">
          <button
            onClick={handleExport}
            className="btn-primary flex items-center gap-2 text-sm py-1.5 px-3"
            title={selectedCount > 0 ? `Exportar ${selectedCount} selecionados` : `Exportar ${filtered.length} visíveis`}
          >
            <Download size={15} />
            {selectedCount > 0 ? `Exportar ${selectedCount}` : `Exportar ${filtered.length}`}
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="card overflow-hidden p-0 hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface text-left text-text-secondary">
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  ref={(el) => { if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected; }}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
              </th>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Contato</th>
              <th className="px-4 py-3 font-medium">Segmento</th>
              <th className="px-4 py-3 font-medium">Etapa</th>
              <th className="px-4 py-3 font-medium">Etiquetas</th>
              <th className="px-4 py-3 font-medium">Origem</th>
              <th className="px-4 py-3 font-medium">Valor Est.</th>
              <th className="px-4 py-3 font-medium">Cidade/UF</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={10} className="px-4 py-8 text-center text-text-secondary">Nenhum lead encontrado.</td></tr>
            ) : filtered.map((lead) => {
              const stage = FUNNEL_STAGES.find((s) => s.key === lead.stage);
              const segment = LEAD_SEGMENTS.find((s) => s.key === lead.segment);
              const source = LEAD_SOURCES.find((s) => s.key === lead.source);
              const isSelected = selectedIds.has(lead.id);
              return (
                <tr
                  key={lead.id}
                  className={`table-row cursor-pointer ${isSelected ? "bg-primary/5" : ""}`}
                  onClick={() => toggleSelect(lead.id)}
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(lead.id)}
                      className="w-4 h-4 rounded cursor-pointer accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{lead.company}</td>
                  <td className="px-4 py-3">
                    <div>{lead.contact_name}</div>
                    {lead.phone && <div className="text-xs text-text-secondary">{formatPhone(lead.phone)}</div>}
                  </td>
                  <td className="px-4 py-3"><span className="badge bg-blue-50 text-blue-700">{segment?.label}</span></td>
                  <td className="px-4 py-3"><span className="badge" style={{ background: `${stage?.color}20`, color: stage?.color }}>{stage?.label}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(lead.labels || []).map((lbl) => (
                        <span key={lbl} className="badge bg-amber-50 text-amber-700 border border-amber-200">🏷️ {lbl}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="badge bg-purple-50 text-purple-700">{source?.label || lead.source}</span></td>
                  <td className="px-4 py-3">{lead.estimated_value > 0 ? formatCurrency(lead.estimated_value) : "-"}</td>
                  <td className="px-4 py-3">{lead.city}{lead.city && lead.state ? "/" : ""}{lead.state}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      {lead.linkedin_url && <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-50 text-[#0A66C2]" title="LinkedIn"><LinkedinIcon size={16} /></a>}
                      <a href={googleSearchUrl(lead)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600" title="Buscar origem"><Globe size={16} /></a>
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
          const source = LEAD_SOURCES.find((s) => s.key === lead.source);
          const isSelected = selectedIds.has(lead.id);
          return (
            <div
              key={lead.id}
              className={`card transition-colors ${isSelected ? "ring-2 ring-primary/40 bg-primary/5" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(lead.id)}
                    className="w-4 h-4 rounded cursor-pointer accent-primary mt-0.5"
                  />
                  <div>
                    <p className="font-semibold">{lead.company}</p>
                    <p className="text-sm text-text-secondary">{lead.contact_name}</p>
                  </div>
                </div>
                <span className="badge text-xs" style={{ background: `${stage?.color}20`, color: stage?.color }}>{stage?.label}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-text-secondary mb-3">
                {lead.phone && <span>{formatPhone(lead.phone)}</span>}
                <span>{lead.city}/{lead.state}</span>
                <span className="badge bg-blue-50 text-blue-700">{segment?.label}</span>
                <span className="badge bg-purple-50 text-purple-700">{source?.label || lead.source}</span>
                {(lead.labels || []).map((lbl) => (
                  <span key={lbl} className="badge bg-amber-50 text-amber-700 border border-amber-200">🏷️ {lbl}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-primary">{lead.estimated_value > 0 ? formatCurrency(lead.estimated_value) : "-"}</span>
                <div className="flex gap-1">
                  {lead.linkedin_url && <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-blue-50 text-[#0A66C2]" title="LinkedIn"><LinkedinIcon size={16} /></a>}
                  <a href={googleSearchUrl(lead)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-600" title="Buscar origem"><Globe size={16} /></a>
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
