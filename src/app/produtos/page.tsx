"use client";

import { useEffect, useState, useCallback } from "react";
import { Package, Save, Edit2 } from "lucide-react";
import { getProducts, updateProduct } from "@/lib/supabase-store";
import { formatCurrency } from "@/lib/format";
import { Product } from "@/lib/types";

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const reload = useCallback(() => { getProducts().then(setProducts); }, []);
  useEffect(() => { reload(); }, [reload]);

  function startEdit(product: Product) {
    setEditingId(product.id);
    setEditPrice(String(product.unit_price));
  }

  async function savePrice(id: string) {
    await updateProduct(id, { unit_price: parseFloat(editPrice) || 0 });
    setEditingId(null);
    reload();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Produtos Vibranihil</h1>
        <p className="text-text-secondary text-sm mt-1">Catalogo de produtos com precos editaveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <Package size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <span className="text-xs text-text-secondary bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">{product.code}</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-3">{product.description}</p>
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Mercado: {product.market}</span>
              </div>
              {product.region_restriction && (
                <p className="text-xs text-amber-600 mt-1">Restricao: {product.region_restriction}</p>
              )}
              <div className="flex items-center justify-between mt-3">
                {editingId === product.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="input w-32"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && savePrice(product.id)}
                    />
                    <button onClick={() => savePrice(product.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600">
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-primary">
                      {product.unit_price > 0 ? formatCurrency(product.unit_price) : "Sem preco"}
                    </span>
                    <button onClick={() => startEdit(product)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600">
                      <Edit2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
