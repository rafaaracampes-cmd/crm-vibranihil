export type FunnelStage =
  | "prospectado"
  | "contato_feito"
  | "orcamento_enviado"
  | "negociacao"
  | "fechado"
  | "perdido";

export const FUNNEL_STAGES: { key: FunnelStage; label: string; color: string }[] = [
  { key: "prospectado", label: "Prospectado", color: "#3B82F6" },
  { key: "contato_feito", label: "Contato Feito", color: "#8B5CF6" },
  { key: "orcamento_enviado", label: "Orçamento Enviado", color: "#F59E0B" },
  { key: "negociacao", label: "Negociação", color: "#EF4444" },
  { key: "fechado", label: "Fechado", color: "#10B981" },
  { key: "perdido", label: "Perdido", color: "#6B7280" },
];

export type LeadSegment =
  | "construtora"
  | "instalador"
  | "arquiteto"
  | "distribuidor"
  | "piscinas"
  | "hvac"
  | "industrial"
  | "outro";

export const LEAD_SEGMENTS: { key: LeadSegment; label: string }[] = [
  { key: "construtora", label: "Construtora" },
  { key: "instalador", label: "Instalador" },
  { key: "arquiteto", label: "Arquiteto" },
  { key: "distribuidor", label: "Distribuidor" },
  { key: "piscinas", label: "Piscinas" },
  { key: "hvac", label: "HVAC" },
  { key: "industrial", label: "Industrial" },
  { key: "outro", label: "Outro" },
];

export type LeadSource =
  | "google_maps"
  | "instagram"
  | "whatsapp"
  | "indicacao"
  | "presencial"
  | "site"
  | "linkedin"
  | "telefone"
  | "evento"
  | "outro";

export const LEAD_SOURCES: { key: LeadSource; label: string }[] = [
  { key: "google_maps", label: "Google Maps" },
  { key: "instagram", label: "Instagram" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "indicacao", label: "Indicação" },
  { key: "presencial", label: "Presencial" },
  { key: "site", label: "Site" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "telefone", label: "Telefone" },
  { key: "evento", label: "Evento/Feira" },
  { key: "outro", label: "Outro" },
];

export interface Lead {
  id: string;
  company: string;
  contact_name: string;
  phone: string;
  email: string;
  segment: LeadSegment;
  stage: FunnelStage;
  source: LeadSource;
  linkedin_url: string;
  city: string;
  state: string;
  notes: string;
  estimated_value: number;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  hardness: string;
  unit_price: number;
  weight_kg: number;
  ipi_percent: number;
  needs_quote: boolean;
  unit: string;
  // campos legados (mantidos para compatibilidade)
  description?: string;
  market?: string;
  region_restriction?: string;
}

export interface QuoteItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Quote {
  id: string;
  lead_id: string;
  lead_company: string;
  items: QuoteItem[];
  subtotal: number;
  discount_percent: number;
  discount_value: number;
  total: number;
  payment_condition: string;
  notes: string;
  created_at: string;
}

export interface MonthlyGoal {
  month: string;
  target: number;
  achieved: number;
}

// Catalogo de produtos movido para product-catalog.ts

export const COMMISSION_RULES = {
  below50k: 0.04,
  above50k: 0.06,
  aboveMonthlyGoal: 0.005,
  monthlyGoal: 150000,
};

export const DISCOUNT_RULES = {
  cashPayment: 0.03,
  above100k: 0.05,
};
