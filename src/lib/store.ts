import { Lead, Product, Quote, FunnelStage } from "./types";
import { PRODUCT_CATALOG } from "./product-catalog";

const STORAGE_KEYS = {
  leads: "vibranihil_leads",
  products: "vibranihil_products",
  quotes: "vibranihil_quotes",
} as const;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try { return JSON.parse(stored); } catch { return fallback; }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Leads
export function getLeads(): Lead[] {
  return getItem<Lead[]>(STORAGE_KEYS.leads, []);
}

export function saveLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  leads.push(newLead);
  setItem(STORAGE_KEYS.leads, leads);
  return newLead;
}

export function updateLead(id: string, data: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...data, updated_at: new Date().toISOString() };
  setItem(STORAGE_KEYS.leads, leads);
  return leads[idx];
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  setItem(STORAGE_KEYS.leads, leads);
}

export function updateLeadStage(id: string, stage: FunnelStage): Lead | null {
  return updateLead(id, { stage });
}

// Products
export function getProducts(): Product[] {
  const products = getItem<Product[]>(STORAGE_KEYS.products, []);
  if (products.length === 0) {
    const defaults: Product[] = PRODUCT_CATALOG.map((p) => ({
      id: generateId(),
      name: p.name,
      code: p.code,
      category: p.category,
      hardness: p.hardness,
      unit_price: p.unit_price,
      weight_kg: p.weight_kg,
      ipi_percent: p.ipi_percent,
      needs_quote: p.needs_quote,
      unit: p.unit,
    }));
    setItem(STORAGE_KEYS.products, defaults);
    return defaults;
  }
  return products;
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data };
  setItem(STORAGE_KEYS.products, products);
  return products[idx];
}

// Quotes
export function getQuotes(): Quote[] {
  return getItem<Quote[]>(STORAGE_KEYS.quotes, []);
}

export function saveQuote(quote: Omit<Quote, "id" | "created_at">): Quote {
  const quotes = getQuotes();
  const newQuote: Quote = {
    ...quote,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  quotes.push(newQuote);
  setItem(STORAGE_KEYS.quotes, quotes);
  return newQuote;
}

export function deleteQuote(id: string): void {
  const quotes = getQuotes().filter((q) => q.id !== id);
  setItem(STORAGE_KEYS.quotes, quotes);
}

// Dashboard stats
export function getMonthlyStats(month?: string) {
  const now = new Date();
  const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const leads = getLeads();
  const quotes = getQuotes();

  const closedLeads = leads.filter(
    (l) => l.stage === "fechado" && l.updated_at.startsWith(targetMonth)
  );
  const totalSales = closedLeads.reduce((sum, l) => sum + l.estimated_value, 0);
  const monthQuotes = quotes.filter((q) => q.created_at.startsWith(targetMonth));
  const totalQuoted = monthQuotes.reduce((sum, q) => sum + q.total, 0);

  const leadsPerStage = leads.reduce(
    (acc, l) => {
      acc[l.stage] = (acc[l.stage] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalSales,
    totalQuoted,
    totalLeads: leads.length,
    closedCount: closedLeads.length,
    leadsPerStage,
    monthlyGoal: 150000,
    goalPercent: Math.min((totalSales / 150000) * 100, 100),
  };
}
