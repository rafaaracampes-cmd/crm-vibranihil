"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, FileText, Trash2, Printer } from "lucide-react";
import { Modal } from "@/components/Modal";
import { getLeads, getProducts, getQuotes, saveQuote, deleteQuote, updateLeadStage } from "@/lib/supabase-store";
import { formatCurrency, formatDate, calculateDiscount } from "@/lib/format";
import { Lead, Product, Quote, QuoteItem } from "@/lib/types";

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

  function addItem() {
    if (products.length === 0) return;
    const p = products[0];
    setItems([...items, { product_id: p.id, product_name: p.name, quantity: 1, unit_price: p.unit_price, subtotal: p.unit_price }]);
  }

  function updateItem(idx: number, field: string, value: string | number) {
    const updated = [...items];
    const item = { ...updated[idx], [field]: value };
    if (field === "product_id") {
      const p = products.find((pr) => pr.id === value);
      if (p) { item.product_name = p.name; item.unit_price = p.unit_price; }
    }
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
      <div className="grid grid-cols-2 gap-4">
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
          <label className="text-sm font-medium">Itens</label>
          <button type="button" onClick={addItem} className="btn-secondary text-xs"><Plus size={14} /> Adicionar Item</button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-text-secondary py-4 text-center">Adicione produtos ao orcamento</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-surface p-2 rounded-lg">
                <select className="select flex-1" value={item.product_id} onChange={(e) => updateItem(idx, "product_id", e.target.value)}>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                </select>
                <input type="number" className="input w-20" min={1} value={item.quantity} onChange={(e) => updateItem(idx, "quantity", parseInt(e.target.value) || 1)} placeholder="Qtd" />
                <input type="number" className="input w-28" min={0} step={0.01} value={item.unit_price || ""} onChange={(e) => updateItem(idx, "unit_price", parseFloat(e.target.value) || 0)} placeholder="Preco un." />
                <span className="text-sm font-medium w-28 text-right">{formatCurrency(item.subtotal)}</span>
                <button onClick={() => removeItem(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
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
    </div>
  );
}

function QuotePrintView({ quote }: { quote: Quote }) {
  return (
    <div className="space-y-6" id="quote-print">
      <div className="text-center border-b border-border pb-4">
        <h2 className="text-2xl font-bold text-primary">VIBRANIHIL</h2>
        <p className="text-sm text-text-secondary">Amortecedores de Vibracao</p>
        <p className="text-xs text-text-secondary mt-1">Rua das Alfazemas, 23 - Vila Alpina - Sao Paulo/SP | (11) 2917-1166</p>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium">Cliente</p>
          <p className="text-lg font-bold">{quote.lead_company}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Orcamento #{quote.id.slice(-6).toUpperCase()}</p>
          <p className="text-sm text-text-secondary">{formatDate(quote.created_at)}</p>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-primary">
            <th className="text-left py-2">Produto</th>
            <th className="text-center py-2">Qtd</th>
            <th className="text-right py-2">Preco Un.</th>
            <th className="text-right py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {quote.items.map((item, i) => (
            <tr key={i} className="border-b border-border">
              <td className="py-2">{item.product_name}</td>
              <td className="text-center py-2">{item.quantity}</td>
              <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
              <td className="text-right py-2">{formatCurrency(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto w-64 space-y-1">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(quote.subtotal)}</span></div>
        {quote.discount_value > 0 && (
          <div className="flex justify-between text-sm text-green-600"><span>Desconto ({(quote.discount_percent * 100).toFixed(0)}%)</span><span>-{formatCurrency(quote.discount_value)}</span></div>
        )}
        <div className="flex justify-between text-lg font-bold border-t border-primary pt-2"><span>Total</span><span>{formatCurrency(quote.total)}</span></div>
      </div>

      <div className="text-sm">
        <p className="font-medium">Condicao: {quote.payment_condition === "a_vista" ? "A Vista" : "A Prazo"}</p>
        {quote.notes && <p className="text-text-secondary mt-1">{quote.notes}</p>}
      </div>

      <div className="text-center text-xs text-text-secondary border-t border-border pt-4">
        <p>Validade: 15 dias | vibranihil.com.br | comercial@vibranihil.com.br</p>
      </div>

      <button onClick={() => window.print()} className="btn-primary no-print mx-auto"><Printer size={16} /> Imprimir / PDF</button>
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
          <h1 className="text-2xl font-bold">Orcamentos</h1>
          <p className="text-text-secondary text-sm mt-1">{quotes.length} orcamentos gerados</p>
        </div>
        <button className="btn-primary" onClick={() => setModalOpen(true)} disabled={leads.length === 0}>
          <Plus size={18} /> Novo Orcamento
        </button>
      </div>

      {leads.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-text-secondary">Cadastre leads primeiro para gerar orcamentos.</p>
        </div>
      )}

      <div className="space-y-3">
        {quotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((quote) => (
          <div key={quote.id} className="card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-amber-50 rounded-lg"><FileText size={20} className="text-amber-600" /></div>
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
