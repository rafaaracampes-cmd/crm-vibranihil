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
      <div className="max-w-[750px] mx-auto bg-white" style={{ fontFamily: "'Inter', Arial, sans-serif" }}>
        {/* ── Header — gradient navy to medium blue ── */}
        <div className="relative overflow-hidden rounded-t-xl">
          <div className="px-8 pt-8 pb-12 relative" style={{ background: "linear-gradient(135deg, #082C6B 0%, #0B3D91 40%, #1E5BB8 100%)" }}>
            {/* Decorative wave in light blue */}
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 750 45" preserveAspectRatio="none" style={{ height: "45px" }}>
              <path d="M0,45 C120,10 300,0 450,18 C600,36 700,8 750,8 L750,45 Z" fill="#DBEAFE" opacity="0.4" />
              <path d="M0,45 C180,8 380,8 520,24 C660,40 750,15 750,15 L750,45 Z" fill="white" />
            </svg>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                {/* Logo original Vibranihil */}
                <img src="/logo-vibranihil.png" alt="Vibranihil" style={{ height: "44px", width: "auto" }} />
                <div>
                  <h1 className="text-3xl font-extrabold text-white tracking-[0.15em]">VIBRANIHIL</h1>
                  <p className="text-[#93C5FD] text-[10px] tracking-[0.25em] uppercase mt-0.5">Amortecedores de Vibração</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-white/90 tracking-tight">ORÇAMENTO</h2>
                <p className="text-[#93C5FD] text-xs mt-1">#{quote.id.slice(-6).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Client + Quote Info ── */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex justify-between gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-[#3B82F6] uppercase tracking-wider mb-1">Para:</p>
              <p className="text-lg font-bold text-[#0F172A]">{quote.lead_company}</p>
            </div>
            <div className="text-right space-y-1.5">
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] text-[#6B7280] uppercase">Data:</span>
                <span className="text-sm font-medium text-[#0F172A]">{formatDate(quote.created_at)}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] text-[#6B7280] uppercase">Validade:</span>
                <span className="text-sm font-medium text-[#0F172A]">15 dias</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-[10px] text-[#6B7280] uppercase">Pagamento:</span>
                <span className="text-sm font-medium text-[#0F172A]">{quote.payment_condition === "a_vista" ? "À Vista" : "A Prazo"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Items Table ── */}
        <div className="px-8 py-2">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white rounded-l-lg" style={{ background: "linear-gradient(90deg, #0B3D91, #1E5BB8)" }}>Descrição do Item</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white" style={{ background: "linear-gradient(90deg, #1E5BB8, #2563EB)" }}>Preço Un.</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white" style={{ background: "#2563EB" }}>Qtd</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white rounded-r-lg" style={{ background: "linear-gradient(90deg, #2563EB, #3B82F6)" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#EFF6FF]"}>
                  <td className="px-4 py-3 border-b border-[#DBEAFE]">
                    <p className="font-medium text-[#0F172A] text-sm">{item.product_name}</p>
                  </td>
                  <td className="px-4 py-3 text-right border-b border-[#DBEAFE] text-[#1E3A5F] whitespace-nowrap">{formatCurrency(item.unit_price)}</td>
                  <td className="px-4 py-3 text-center border-b border-[#DBEAFE] text-[#1E3A5F]">{item.quantity}</td>
                  <td className="px-4 py-3 text-right border-b border-[#DBEAFE] font-semibold text-[#0B3D91] whitespace-nowrap">{formatCurrency(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Totals + Notes ── */}
        <div className="px-8 py-4">
          <div className="flex gap-6">
            <div className="flex-1">
              {quote.notes && (
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-[#3B82F6] uppercase tracking-wider mb-1">Observações</p>
                  <p className="text-sm text-[#475569] leading-relaxed">{quote.notes}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-semibold text-[#3B82F6] uppercase tracking-wider mb-1">Informações de Pagamento</p>
                <p className="text-sm text-[#475569]">Condição: {quote.payment_condition === "a_vista" ? "À Vista (3% desconto)" : "A Prazo"}</p>
                <p className="text-sm text-[#475569]">Consultar prazo de entrega</p>
              </div>
            </div>

            <div className="w-64 shrink-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm text-[#6B7280]">Subtotal</span>
                  <span className="text-sm font-medium text-[#0F172A]">{formatCurrency(quote.subtotal)}</span>
                </div>
                {quote.discount_value > 0 && (
                  <div className="flex justify-between items-center px-2">
                    <span className="text-sm text-[#2563EB]">Desconto ({(quote.discount_percent * 100).toFixed(0)}%)</span>
                    <span className="text-sm font-medium text-[#2563EB]">-{formatCurrency(quote.discount_value)}</span>
                  </div>
                )}
                <div className="rounded-lg px-4 py-3 flex justify-between items-center mt-2" style={{ background: "linear-gradient(135deg, #082C6B, #0B3D91, #1E5BB8)" }}>
                  <span className="text-sm font-semibold text-white uppercase tracking-wide">Total</span>
                  <span className="text-xl font-bold text-white">{formatCurrency(quote.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-8 pt-4 pb-6 mt-4">
          <div className="border-t-2 border-[#BFDBFE] pt-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-semibold text-[#1E5BB8]">Obrigado pela preferência!</p>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-[#6B7280]">Rua das Alfazemas, 23 – Vila Alpina – São Paulo/SP</p>
                  <p className="text-xs text-[#6B7280]">(11) 2917-1166 · comercial@vibranihil.com.br</p>
                  <p className="text-xs text-[#6B7280]">vibranihil.com.br</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-40 border-t border-[#93C5FD] pt-2 ml-auto">
                  <p className="text-xs font-semibold text-[#0F172A]">Isabela Campes</p>
                  <p className="text-[10px] text-[#6B7280]">Representante Comercial</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar — rich blue gradient */}
        <div className="h-2 rounded-b-xl" style={{ background: "linear-gradient(90deg, #082C6B, #0B3D91, #1E5BB8, #2563EB, #3B82F6)" }} />
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
