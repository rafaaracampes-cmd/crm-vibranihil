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
    city: initial?.city || "",
    state: initial?.state || "SP",
    notes: initial?.notes || "",
    estimated_value: initial?.estimated_value || 0,
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  function update(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
