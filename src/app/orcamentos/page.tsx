"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, FileText, Trash2, Printer, Search, AlertCircle } from "lucide-react";
import { Modal } from "@/components/Modal";
import { getLeads, getProducts, getQuotes, saveQuote, deleteQuote, updateLeadStage, seedProducts } from "@/lib/supabase-store";
import { formatCurrency, formatDate, calculateDiscount } from "@/lib/format";
import { Lead, Product, Quote, QuoteItem } from "@/lib/types";
import { PRODUCT_CATEGORIES } from "@/lib/product-catalog";

function ProductSelector({ products, onSelect, onClose }: {
  products: Product[];
  onSelect: (product: Product) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  // group by category
  const grouped = PRODUCT_CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter((p) => p.category === cat.key);
    if (items.length > 0) acc.push({ label: cat.label, items });
    return acc;
  }, [] as { label: string; items: Product[] }[]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            ref={inputRef}
            className="input pl-8 text-sm"
            placeholder="Buscar produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="select text-sm w-auto" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">Todas categorias</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="max-h-[400px] overflow-y-auto space-y-4">
        {grouped.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-4">Nenhum produto encontrado</p>
        ) : grouped.map((group) => (
          <div key={group.label}>
            <h4 className="text-xs font-semibold text-text-secondary uppercase mb-1 px-1">{group.label}</h4>
            <div className="space-y-1">
              {group.items.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { onSelect(p); onClose(); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-surface transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{p.code}</span>
                      <span className="text-sm font-medium truncate">{p.name}</span>
                    </div>
                    {p.hardness && (
                      <span className="text-xs text-text-secondary">{p.hardness}</span>
                    )}
                  </div>
                  <div className="ml-2 text-right">
                    {p.needs_quote && p.unit_price === 0 ? (
                      <span className="text-xs text-amber-600 flex items-center gap-1"><AlertCircle size={12} /> Consulta</span>
                    ) : (
                      <span className="text-sm font-semibold text-primary">{formatCurrency(p.unit_price)}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2 border-t border-border">
        <button onClick={onClose} className="btn-secondary text-sm">Fechar</button>
      </div>
    </div>
  );
}

function QuoteForm({ leads, products, onSave, onCancel }: {
  leads: Lead[];
  products: Product[];
  onSave: (q: Omit<Quote, "id" | "created_at">) => void;
  onCancel: () => void;
}) {
  const [leadId, setLeadId] = useState(leads[0]?.id || "");
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [payment, setPayment] = useState("a_prazo");
  const [notes, setNotes] = useState("");
  const [showSelector, setShowSelector] = useState(false);

  function addProduct(product: Product) {
    setItems([...items, {
      product_id: product.id,
      product_name: `${product.name}${product.hardness ? ` (${product.hardness})` : ""} [${product.code}]`,
      quantity: 1,
      unit_price: product.unit_price,
      subtotal: product.unit_price,
    }]);
  }

  function updateItem(idx: number, field: string, value: string | number) {
    const updated = [...items];
    const item = { ...updated[idx], [field]: value };
    item.subtotal = item.quantity * item.unit_price;
    updated[idx] = item;
    setItems(updated);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const { percent: discountPercent, value: discountValue } = calculateDiscount(subtotal, payment);
  const total = subtotal - discountValue;
  const selectedLead = leads.find((l) => l.id === leadId);

  function handleSubmit() {
    if (!leadId || items.length === 0) return;
    onSave({
      lead_id: leadId,
      lead_company: selectedLead?.company || "",
      items,
      subtotal,
      discount_percent: discountPercent,
      discount_value: discountValue,
      total,
      payment_condition: payment,
      notes,
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Lead / Cliente</label>
          <select className="select" value={leadId} onChange={(e) => setLeadId(e.target.value)}>
            {leads.map((l) => <option key={l.id} value={l.id}>{l.company}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Condicao de Pagamento</label>
          <select className="select" value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="a_prazo">A Prazo</option>
            <option value="a_vista">A Vista (3% desc.)</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Itens do Orcamento</label>
          <button type="button" onClick={() => setShowSelector(true)} className="btn-secondary text-xs">
            <Plus size={14} /> Adicionar Produto
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-surface rounded-lg p-6 text-center">
            <p className="text-sm text-text-secondary">Clique em &quot;Adicionar Produto&quot; para selecionar do catalogo</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="bg-surface p-3 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium flex-1 mr-2">{item.product_name}</p>
                  <button onClick={() => removeItem(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-text-secondary">Qtd:</label>
                    <input
                      type="number"
                      className="input w-16 text-sm py-1"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-text-secondary">Preco un.:</label>
                    <input
                      type="number"
                      className="input w-24 text-sm py-1"
                      min={0}
                      step={0.01}
                      value={item.unit_price || ""}
                      onChange={(e) => updateItem(idx, "unit_price", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary ml-auto">{formatCurrency(item.subtotal)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Observacoes</label>
        <textarea className="input min-h-[60px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="bg-surface rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        {discountValue > 0 && (
          <div className="flex justify-between text-sm text-green-600"><span>Desconto ({(discountPercent * 100).toFixed(0)}%)</span><span>-{formatCurrency(discountValue)}</span></div>
        )}
        <div className="flex justify-between text-lg font-bold border-t border-border pt-2"><span>Total</span><span className="text-primary">{formatCurrency(total)}</span></div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="button" onClick={handleSubmit} className="btn-primary" disabled={items.length === 0}>Gerar Orcamento</button>
      </div>

      <Modal open={showSelector} onClose={() => setShowSelector(false)} title="Selecionar Produto" maxWidth="max-w-2xl">
        <ProductSelector products={products} onSelect={addProduct} onClose={() => setShowSelector(false)} />
      </Modal>
    </div>
  );
}

function QuotePrintView({ quote }: { quote: Quote }) {
  return (
    <div id="quote-print-root">
      <div className="max-w-[750px] mx-auto bg-white relative overflow-hidden" style={{ fontFamily: "'Inter', Arial, sans-serif" }}>

        {/* ── Decorative geometric shapes ── */}
        {/* Top-left circle */}
        <div style={{ position: "absolute", top: "-30px", left: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "#DBEAFE", opacity: 0.6 }} />
        <div style={{ position: "absolute", top: "10px", left: "10px", width: "50px", height: "50px", borderRadius: "50%", background: "#0B3D91", opacity: 0.15 }} />
        {/* Top-right rounded rect */}
        <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "90px", height: "90px", borderRadius: "20px", background: "#0B3D91", transform: "rotate(15deg)", opacity: 0.08 }} />
        {/* Bottom-right shapes */}
        <div style={{ position: "absolute", bottom: "60px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "#DBEAFE", opacity: 0.5 }} />
        <div style={{ position: "absolute", bottom: "80px", right: "20px", width: "40px", height: "40px", borderRadius: "50%", background: "#0B3D91", opacity: 0.12 }} />
        {/* Bottom-left accent */}
        <div style={{ position: "absolute", bottom: "50px", left: "-15px", width: "60px", height: "60px", borderRadius: "16px", background: "#0B3D91", transform: "rotate(-20deg)", opacity: 0.07 }} />

        {/* ── Header: Logo + ORÇAMENTO ── */}
        <div className="relative z-10 px-8 pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <img src="/logo-vibranihil.png" alt="Vibranihil" style={{ height: "44px", width: "auto" }} />
            </div>
            <div className="text-right">
              <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#0B3D91", letterSpacing: "0.04em", lineHeight: 1 }}>
                ORÇAMENTO
              </h1>
            </div>
          </div>
        </div>

        {/* ── Divider line ── */}
        <div className="mx-8 h-[2px]" style={{ background: "linear-gradient(90deg, #0B3D91, #3B82F6, #93C5FD)" }} />

        {/* ── Client info + Quote details ── */}
        <div className="relative z-10 px-8 pt-5 pb-4">
          <div className="flex justify-between gap-6">
            <div>
              <p style={{ fontSize: "10px", fontWeight: 700, color: "#0B3D91", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Orçamento para:</p>
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>{quote.lead_company}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#6B7280", textTransform: "uppercase" }}>Nº:</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>#{quote.id.slice(-6).toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#6B7280", textTransform: "uppercase" }}>Data:</span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#0F172A" }}>{formatDate(quote.created_at)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                  <span style={{ fontSize: "10px", color: "#6B7280", textTransform: "uppercase" }}>Validade:</span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#0F172A" }}>15 dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column: Left info + Right table ── */}
        <div className="relative z-10 px-8 pb-4">
          <div style={{ display: "flex", gap: "24px" }}>

            {/* Left column: Payment + Terms */}
            <div style={{ width: "170px", flexShrink: 0 }}>
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#0B3D91", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Cond. Pagamento</p>
                <p style={{ fontSize: "12px", color: "#475569" }}>{quote.payment_condition === "a_vista" ? "À Vista (3% desc.)" : "A Prazo"}</p>
              </div>

              {quote.notes && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#0B3D91", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Observações</p>
                  <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5 }}>{quote.notes}</p>
                </div>
              )}

              <div>
                <p style={{ fontSize: "10px", fontWeight: 700, color: "#0B3D91", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Informações</p>
                <p style={{ fontSize: "11px", color: "#475569", lineHeight: 1.5 }}>Consultar prazo de entrega. Preços sujeitos a alteração sem aviso prévio.</p>
              </div>
            </div>

            {/* Right column: Product table + totals */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px 12px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white", background: "#0B3D91", borderTopLeftRadius: "6px" }}>Produto</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white", background: "#0B3D91" }}>Preço</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white", background: "#0B3D91" }}>Qtd</th>
                    <th style={{ textAlign: "right", padding: "10px 12px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "white", background: "#0B3D91", borderTopRightRadius: "6px" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#F0F7FF" }}>
                      <td style={{ padding: "9px 12px", borderBottom: "1px solid #E2E8F0", color: "#0F172A", fontWeight: 500 }}>{item.product_name}</td>
                      <td style={{ padding: "9px 12px", borderBottom: "1px solid #E2E8F0", textAlign: "right", color: "#334155", whiteSpace: "nowrap" }}>{formatCurrency(item.unit_price)}</td>
                      <td style={{ padding: "9px 12px", borderBottom: "1px solid #E2E8F0", textAlign: "center", color: "#334155" }}>{item.quantity}</td>
                      <td style={{ padding: "9px 12px", borderBottom: "1px solid #E2E8F0", textAlign: "right", color: "#0B3D91", fontWeight: 600, whiteSpace: "nowrap" }}>{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ marginTop: "12px", borderTop: "2px solid #E2E8F0", paddingTop: "8px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "4px 12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Subtotal</span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#0F172A", minWidth: "90px", textAlign: "right" }}>{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount_value > 0 && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "4px 12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#2563EB", textTransform: "uppercase" }}>Desconto ({(quote.discount_percent * 100).toFixed(0)}%)</span>
                    <span style={{ fontSize: "13px", fontWeight: 500, color: "#2563EB", minWidth: "90px", textAlign: "right" }}>-{formatCurrency(quote.discount_value)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "40px", padding: "6px 12px", marginTop: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0B3D91", textTransform: "uppercase" }}>Total</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "#0B3D91", minWidth: "90px", textAlign: "right" }}>{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Signature ── */}
        <div className="relative z-10 px-8 pt-4 pb-4">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ textAlign: "center", width: "200px" }}>
              <div style={{ borderTop: "1px solid #94A3B8", paddingTop: "8px", marginTop: "24px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A" }}>Isabela Campes</p>
                <p style={{ fontSize: "10px", color: "#6B7280" }}>Representante Comercial</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer bar ── */}
        <div className="relative z-10" style={{ background: "#0B3D91", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "32px" }}>
          <span style={{ fontSize: "12px", color: "white", fontWeight: 500 }}>(11) 2917-1166</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>|</span>
          <span style={{ fontSize: "12px", color: "white", fontWeight: 500 }}>comercial@vibranihil.com.br</span>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>|</span>
          <span style={{ fontSize: "12px", color: "white", fontWeight: 500 }}>vibranihil.com.br</span>
        </div>
      </div>

      <div className="flex justify-center mt-6 no-print">
        <button onClick={() => window.print()} className="btn-primary"><Printer size={16} /> Imprimir / Salvar PDF</button>
      </div>
    </div>
  );
}

export default function OrcamentosPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewQuote, setViewQuote] = useState<Quote | null>(null);

  const reload = useCallback(async () => {
    await seedProducts();
    setQuotes(await getQuotes());
    setLeads(await getLeads());
    setProducts(await getProducts());
  }, []);

  useEffect(() => { reload(); }, [reload]);

  async function handleSave(data: Omit<Quote, "id" | "created_at">) {
    await saveQuote(data);
    await updateLeadStage(data.lead_id, "orcamento_enviado");
    setModalOpen(false);
    reload();
  }

  async function handleDeleteQuote(id: string) {
    if (confirm("Excluir este orcamento?")) {
      await deleteQuote(id);
      reload();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Orcamentos</h1>
          <p className="text-text-secondary text-sm mt-1">{quotes.length} orcamentos gerados</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)} disabled={leads.length === 0}>
          <Plus size={18} /> <span className="hidden sm:inline">Novo Orcamento</span>
        </button>
      </div>

      {leads.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-text-secondary">Cadastre leads primeiro para gerar orcamentos.</p>
        </div>
      )}

      <div className="space-y-3">
        {quotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((quote) => (
          <div key={quote.id} className="card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-50 rounded-lg flex-shrink-0"><FileText size={20} className="text-amber-600" /></div>
              <div>
                <p className="font-medium">{quote.lead_company}</p>
                <p className="text-xs text-text-secondary">{formatDate(quote.created_at)} | {quote.items.length} itens</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold text-primary">{formatCurrency(quote.total)}</p>
              <button onClick={() => setViewQuote(quote)} className="btn-secondary text-xs"><FileText size={14} /> Ver</button>
              <button onClick={() => handleDeleteQuote(quote.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Orcamento" maxWidth="max-w-3xl">
        <QuoteForm leads={leads} products={products} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!viewQuote} onClose={() => setViewQuote(null)} title="Orcamento" maxWidth="max-w-2xl">
        {viewQuote && <QuotePrintView quote={viewQuote} />}
      </Modal>
    </div>
  );
}
