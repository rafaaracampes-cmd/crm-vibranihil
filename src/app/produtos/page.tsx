"use client";

import { useEffect, useState, useCallback } from "react";
import { Package, Save, Edit2, Search, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { getProducts, updateProduct, seedProducts } from "@/lib/supabase-store";
import { formatCurrency } from "@/lib/format";
import { Product } from "@/lib/types";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/product-catalog";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    await seedProducts();
    const prods = await getProducts();
    setProducts(prods);
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  function toggleCategory(cat: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

  function expandAll() {
    setExpandedCategories(new Set(PRODUCT_CATEGORIES.map((c) => c.key)));
  }

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditPrice(String(product.unit_price));
  }

  async function savePrice(id: string) {
    await updateProduct(id, { unit_price: parseFloat(editPrice) || 0 });
    setEditingId(null);
    reload();
  }

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          (p.hardness || "").toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const grouped = PRODUCT_CATEGORIES.reduce((acc, cat) => {
    const items = filtered.filter((p) => p.category === cat.key);
    if (items.length > 0) acc.push({ ...cat, items });
    return acc;
  }, [] as (typeof PRODUCT_CATEGORIES[number] & { items: Product[] })[]);

  // Auto-expand when searching
  useEffect(() => {
    if (search) expandAll();
  }, [search]);

  const totalProducts = products.length;
  const withPrice = products.filter((p) => p.unit_price > 0 && !p.needs_quote).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Produtos Vibranihil</h1>
          <p className="text-text-secondary text-sm mt-1">
            {totalProducts} produtos | {withPrice} com preco tabelado
          </p>
        </div>
        <button onClick={expandAll} className="btn-secondary text-xs">
          Expandir Tudo
        </button>
      </div>

      <div className="card mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            className="input pl-9"
            placeholder="Buscar por nome, codigo ou dureza..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="card text-center py-8 text-text-secondary">Carregando catalogo...</div>
      ) : (
        <div className="space-y-3">
          {grouped.map((group) => (
            <div key={group.key} className="card p-0 overflow-hidden">
              <button
                onClick={() => toggleCategory(group.key)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-50 rounded-lg">
                    <Package size={18} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">{group.label}</h3>
                    <p className="text-xs text-text-secondary">{group.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary bg-gray-100 px-2 py-1 rounded-full">
                    {group.items.length} itens
                  </span>
                  {expandedCategories.has(group.key) ? (
                    <ChevronDown size={16} className="text-text-secondary" />
                  ) : (
                    <ChevronRight size={16} className="text-text-secondary" />
                  )}
                </div>
              </button>

              {expandedCategories.has(group.key) && (
                <div className="border-t border-border">
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-surface text-left text-text-secondary text-xs">
                          <th className="px-4 py-2 font-medium">Codigo</th>
                          <th className="px-4 py-2 font-medium">Descricao</th>
                          <th className="px-4 py-2 font-medium">Dureza</th>
                          <th className="px-4 py-2 font-medium text-right">Preco (R$)</th>
                          <th className="px-4 py-2 font-medium text-right">Peso (kg)</th>
                          <th className="px-4 py-2 font-medium text-right">IPI %</th>
                          <th className="px-4 py-2 font-medium text-right w-20">Acao</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((product) => (
                          <tr key={product.id} className="table-row border-t border-border/50">
                            <td className="px-4 py-2">
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">{product.code}</span>
                            </td>
                            <td className="px-4 py-2 font-medium text-xs">{product.name}</td>
                            <td className="px-4 py-2">
                              {product.hardness ? (
                                <span className="text-xs badge bg-blue-50 text-blue-700">{product.hardness}</span>
                              ) : (
                                <span className="text-xs text-text-secondary">-</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {editingId === product.id ? (
                                <div className="flex items-center justify-end gap-1">
                                  <input
                                    type="number"
                                    className="input w-24 text-xs py-1"
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && savePrice(product.id)}
                                  />
                                  <button onClick={() => savePrice(product.id)} className="p-1 rounded hover:bg-green-50 text-green-600">
                                    <Save size={14} />
                                  </button>
                                </div>
                              ) : product.needs_quote && product.unit_price === 0 ? (
                                <span className="text-xs text-amber-600 flex items-center justify-end gap-1">
                                  <AlertCircle size={12} /> Sob consulta
                                </span>
                              ) : (
                                <span className="font-semibold text-primary text-xs">
                                  {formatCurrency(product.unit_price)}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right text-xs text-text-secondary">
                              {product.weight_kg > 0 ? product.weight_kg.toFixed(3) : "-"}
                            </td>
                            <td className="px-4 py-2 text-right text-xs text-text-secondary">
                              {product.ipi_percent > 0 ? `${product.ipi_percent}%` : "-"}
                            </td>
                            <td className="px-4 py-2 text-right">
                              {editingId !== product.id && (
                                <button onClick={() => startEdit(product)} className="p-1 rounded hover:bg-blue-50 text-blue-600">
                                  <Edit2 size={14} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile list */}
                  <div className="md:hidden divide-y divide-border/50">
                    {group.items.map((product) => (
                      <div key={product.id} className="px-4 py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono">{product.code}</span>
                              {product.hardness && (
                                <span className="text-xs badge bg-blue-50 text-blue-700">{product.hardness}</span>
                              )}
                            </div>
                            <p className="text-sm font-medium mt-1">{product.name}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {editingId === product.id ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  className="input w-20 text-xs py-1"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  autoFocus
                                  onKeyDown={(e) => e.key === "Enter" && savePrice(product.id)}
                                />
                                <button onClick={() => savePrice(product.id)} className="p-1 rounded hover:bg-green-50 text-green-600">
                                  <Save size={14} />
                                </button>
                              </div>
                            ) : product.needs_quote && product.unit_price === 0 ? (
                              <span className="text-xs text-amber-600">Consulta</span>
                            ) : (
                              <span className="font-semibold text-primary text-sm">
                                {formatCurrency(product.unit_price)}
                              </span>
                            )}
                            {editingId !== product.id && (
                              <button onClick={() => startEdit(product)} className="p-1 rounded hover:bg-blue-50 text-blue-600">
                                <Edit2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
