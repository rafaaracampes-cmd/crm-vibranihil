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

export interface Lead {
  id: string;
  company: string;
  contact_name: string;
  phone: string;
  email: string;
  segment: LeadSegment;
  stage: FunnelStage;
  city: string;
  state: string;
  notes: string;
  estimated_value: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  market: string;
  region_restriction: string;
  unit_price: number;
  unit: string;
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

export const DEFAULT_PRODUCTS: Omit<Product, "id">[] = [
  { name: "Amortecedor AME", code: "AME", description: "Amortecedor em molas helicoidais de aço com núcleo elastomérico. Frequências de 2Hz, 3Hz e 5Hz.", market: "Construção Civil - HVAC", region_restriction: "Todas, menos Sul BR, Rio, Chile, Colômbia e Paraguai", unit_price: 0, unit: "un" },
  { name: "Base de Inércia", code: "BI", description: "Base anti-vibratória para suporte de equipamentos. Adiciona rigidez e reduz oscilações.", market: "Construção Civil - HVAC", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "Base para Motobomba", code: "BM", description: "Base específica para instalação de motobombas com isolamento de vibração.", market: "Construção Civil - HVAC", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "Coxim", code: "CB", description: "Isoladores de vibração metal-borracha para equipamentos acima de 1.200 RPM.", market: "Construção Civil - HVAC", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "AM PN", code: "AMPN", description: "Pé isolador de vibração com nivelador. Permite ajuste fino de altura.", market: "Todos", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "AM TCB", code: "AMTCB", description: "Amortecedor para equipamentos embarcados. Isolamento a partir de 22Hz.", market: "Todos", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "PAD", code: "PAD", description: "Placas de borracha de alta durabilidade. Frequência natural de 8 a 22Hz.", market: "Todos", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "AMF 3510", code: "AMF3510", description: "Amortecedor com suporte para aplicações estruturais.", market: "Todos", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "IsoDoble", code: "ISODOBLE", description: "Isolador acústico para parede e teto. Desconexão total para isolamento de ruído.", market: "Todos", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "SilenZi", code: "SILENZI", description: "Sistema de isolamento acústico para ambientes.", market: "Todos", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "Apoio Simples", code: "AS", description: "Apoio básico para isolamento de vibração.", market: "Todos", region_restriction: "", unit_price: 0, unit: "un" },
  { name: "K-PAD", code: "KPAD", description: "Placas de espuma de polietileno com PAD central. Frequência de 7.8 a 22Hz. Para piscinas, helipontos, academias.", market: "Exportação", region_restriction: "Menos Chile, Colômbia e Paraguai", unit_price: 0, unit: "un" },
];

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
