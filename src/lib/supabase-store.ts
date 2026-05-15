import { isSupabaseConfigured, getSupabaseClient } from "./supabase";
import * as localStore from "./store";
import { Lead, Product, Quote, FunnelStage } from "./types";
import { PRODUCT_CATALOG } from "./product-catalog";

function useCloud(): boolean {
  return isSupabaseConfigured();
}

function db() {
  return getSupabaseClient();
}

export async function getLeads(): Promise<Lead[]> {
  if (!useCloud()) return localStore.getLeads();
  const { data } = await db().from("leads").select("*").order("updated_at", { ascending: false });
  return (data || []).map((d) => ({ ...d, estimated_value: Number(d.estimated_value) }));
}

export async function saveLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">): Promise<Lead | null> {
  if (!useCloud()) return localStore.saveLead(lead);
  const { data: { user } } = await db().auth.getUser();
  const { data } = await db().from("leads").insert({ ...lead, user_id: user?.id }).select().single();
  return data;
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
  if (!useCloud()) return localStore.updateLead(id, updates);
  const { data } = await db().from("leads").update(updates).eq("id", id).select().single();
  return data;
}

export async function deleteLead(id: string): Promise<void> {
  if (!useCloud()) { localStore.deleteLead(id); return; }
  await db().from("leads").delete().eq("id", id);
}

export async function updateLeadStage(id: string, stage: FunnelStage): Promise<Lead | null> {
  return updateLead(id, { stage });
}

export async function getProducts(): Promise<Product[]> {
  if (!useCloud()) return localStore.getProducts();
  const { data } = await db().from("products").select("*").order("category").order("name");
  return (data || []).map((d) => ({
    ...d,
    unit_price: Number(d.unit_price),
    weight_kg: Number(d.weight_kg || 0),
    ipi_percent: Number(d.ipi_percent || 0),
    needs_quote: d.needs_quote || false,
  }));
}

export async function seedProducts(): Promise<void> {
  if (!useCloud()) return;
  const { data: existing } = await db().from("products").select("id").limit(1);
  if (existing && existing.length > 0) return; // already seeded
  const { data: { user } } = await db().auth.getUser();
  const rows = PRODUCT_CATALOG.map((p) => ({
    name: p.name,
    code: p.code,
    category: p.category,
    hardness: p.hardness,
    unit_price: p.unit_price,
    weight_kg: p.weight_kg,
    ipi_percent: p.ipi_percent,
    needs_quote: p.needs_quote,
    unit: p.unit,
    user_id: user?.id,
  }));
  // Insert in batches of 50
  for (let i = 0; i < rows.length; i += 50) {
    await db().from("products").insert(rows.slice(i, i + 50));
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (!useCloud()) return localStore.updateProduct(id, updates);
  const { data } = await db().from("products").update(updates).eq("id", id).select().single();
  return data;
}

export async function getQuotes(): Promise<Quote[]> {
  if (!useCloud()) return localStore.getQuotes();
  const { data } = await db().from("quotes").select("*").order("created_at", { ascending: false });
  return (data || []).map((d) => ({
    ...d,
    subtotal: Number(d.subtotal),
    discount_percent: Number(d.discount_percent),
    discount_value: Number(d.discount_value),
    total: Number(d.total),
  }));
}

export async function saveQuote(quote: Omit<Quote, "id" | "created_at">): Promise<Quote | null> {
  if (!useCloud()) { localStore.saveQuote(quote); return null; }
  const { data: { user } } = await db().auth.getUser();
  const { data } = await db().from("quotes").insert({ ...quote, user_id: user?.id }).select().single();
  return data;
}

export async function deleteQuote(id: string): Promise<void> {
  if (!useCloud()) { localStore.deleteQuote(id); return; }
  await db().from("quotes").delete().eq("id", id);
}

export async function getMonthlyStats(month?: string) {
  if (!useCloud()) return localStore.getMonthlyStats(month);

  const now = new Date();
  const targetMonth = month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const startDate = `${targetMonth}-01`;
  const endDate = `${targetMonth}-31`;

  const leads = await getLeads();
  const quotes = await getQuotes();

  const closedLeads = leads.filter(
    (l) => l.stage === "fechado" && l.updated_at >= startDate && l.updated_at <= endDate
  );
  const totalSales = closedLeads.reduce((sum, l) => sum + l.estimated_value, 0);
  const monthQuotes = quotes.filter(
    (q) => q.created_at >= startDate && q.created_at <= endDate
  );
  const totalQuoted = monthQuotes.reduce((sum, q) => sum + q.total, 0);

  const leadsPerStage = leads.reduce(
    (acc, l) => { acc[l.stage] = (acc[l.stage] || 0) + 1; return acc; },
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
