"use client";

import { useState, type FormEvent } from "react";
import { Lead, LEAD_SEGMENTS, FUNNEL_STAGES, LEAD_SOURCES, type LeadSegment, type FunnelStage, type LeadSource } from "@/lib/types";

interface LeadFormProps {
  initial?: Lead;
  onSubmit: (data: Omit<Lead, "id" | "created_at" | "updated_at">) => void;
  onCancel: () => void;
}

const STATES = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];

export function LeadForm({ initial, onSubmit, onCancel }: LeadFormProps) {
  const [form, setForm] = useState({
    company: initial?.company || "",
    contact_name: initial?.contact_name || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    segment: (initial?.segment || "construtora") as LeadSegment,
    stage: (initial?.stage || "prospectado") as FunnelStage,
    source: (initial?.source || "google_maps") as LeadSource,
    linkedin_url: initial?.linkedin_url || "",
    city: initial?.city || "",
    state: initial?.state || "SP",
    notes: initial?.notes || "",
    estimated_value: initial?.estimated_value || 0,
    labels: initial?.labels || [],
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  function update(field: string, value: string | number | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleLabel(lbl: string) {
    setForm((prev) => {
      const current = prev.labels || [];
      return {
        ...prev,
        labels: current.includes(lbl) ? current.filter((l) => l !== lbl) : [...current, lbl],
      };
    });
  }

  function addCustomLabel(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem("newLabel") as HTMLInputElement;
    const val = input.value.trim().toLowerCase();
    if (val && !(form.labels || []).includes(val)) {
      update("labels", [...(form.labels || []), val]);
      input.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Empresa *</label>
          <input className="input" required value={form.company} onChange={(e) => update("company", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contato</label>
          <input className="input" value={form.contact_name} onChange={(e) => update("contact_name", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Telefone / WhatsApp</label>
          <input className="input" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="(11) 99999-9999" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="input" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Segmento</label>
          <select className="select" value={form.segment} onChange={(e) => update("segment", e.target.value)}>
            {LEAD_SEGMENTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Etapa do Funil</label>
          <select className="select" value={form.stage} onChange={(e) => update("stage", e.target.value)}>
            {FUNNEL_STAGES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Origem</label>
          <select className="select" value={form.source} onChange={(e) => update("source", e.target.value)}>
            {LEAD_SOURCES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cidade</label>
          <input className="input" value={form.city} onChange={(e) => update("city", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select className="select" value={form.state} onChange={(e) => update("state", e.target.value)}>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Valor Estimado (R$)</label>
          <input className="input" type="number" min={0} step={0.01} value={form.estimated_value || ""} onChange={(e) => update("estimated_value", parseFloat(e.target.value) || 0)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">LinkedIn (URL do perfil)</label>
          <input className="input" type="url" value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/nome-do-contato" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Etiquetas</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {(form.labels || []).map((lbl) => (
            <span key={lbl} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
              🏷️ {lbl}
              <button type="button" onClick={() => toggleLabel(lbl)} className="ml-0.5 hover:text-red-500 font-bold">×</button>
            </span>
          ))}
        </div>
        <form onSubmit={addCustomLabel} className="flex gap-2">
          <input name="newLabel" className="input flex-1 text-sm py-1" placeholder="Nova etiqueta (ex: drywall, gesso...)" />
          <button type="submit" className="btn-secondary text-xs px-3">+ Adicionar</button>
        </form>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Observações</label>
        <textarea className="input min-h-[80px]" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" className="btn-primary">Salvar</button>
      </div>
    </form>
  );
}
